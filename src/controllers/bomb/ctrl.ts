import { RequestHandler } from 'express';
import { toResponse } from '../../lib/dtos';
import {
    CreateBombRequest,
    GetBombFileByLongIdRequest,
    GetBombListRequest,
} from './request.dto';
import { ForbiddenError, NotFoundError } from '../../lib/http-errors';
import { BombDAO, LabDAO, UserDAO } from '../../daos';
import { CreateBombResponse, GetBombListResponse } from './response.dto';
import { createStringId } from '../../lib/string-id';
import {
    createBombAndGetSolution,
    downloadBombFile,
} from '../../lib/bomb-server';

const MAX_GRADING_PHASE = parseInt(process.env.MAX_GRADING_PHASE ?? '5', 10);

export const getBombList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;

    const { authorName, labName } = new GetBombListRequest(req);

    if (requester.isStudent && authorName && requester.username !== authorName)
        throw ForbiddenError;

    const author = authorName ? await UserDAO.getByUsername(authorName) : null;
    if (authorName && !author) throw NotFoundError;

    const lab = labName
        ? await LabDAO.getByName(labName, requester.isAdmin)
        : null;
    if (labName && !lab) throw NotFoundError;
    if (lab && requester.isStudent && !lab.isOpen) throw ForbiddenError;

    const bombs = await BombDAO.getListByLabAndAuthor(author, lab);

    const bombsWithDefuseSummary = bombs.map(bomb => {
        let isMaxGradingPhaseDefused = false;
        const summary = bomb.defuseTrials.reduce(
            (acc, cur) => {
                const { maxPhase, explosions, lastSubmittedAt } = acc;
                const { phase, exploded, createdAt } = cur;

                const includeGrading = !isMaxGradingPhaseDefused;

                if (phase === MAX_GRADING_PHASE && !exploded)
                    isMaxGradingPhaseDefused = true;

                return {
                    maxPhase: exploded ? maxPhase : Math.max(maxPhase, phase),
                    explosions:
                        explosions + (exploded && includeGrading ? 1 : 0),
                    lastSubmittedAt: includeGrading
                        ? Math.max(lastSubmittedAt, createdAt)
                        : lastSubmittedAt,
                };
            },
            { maxPhase: 0, explosions: 0, lastSubmittedAt: 0 },
        );
        return { ...bomb, ...summary };
    });

    return res.send(
        toResponse(GetBombListResponse, bombsWithDefuseSummary, [
            requester.role,
        ]),
    );
};

export const getBombFileByLongId: RequestHandler = async (req, res) => {
    const { requester } = res.locals;

    const { longId } = new GetBombFileByLongIdRequest(req);

    const bomb = await BombDAO.getByLongId(longId);
    if (!bomb) throw NotFoundError;

    if (requester.isStudent && !bomb.author.is(requester)) throw ForbiddenError;
    if (requester.isStudent && !bomb.lab.isOpen) throw ForbiddenError;

    const file = await downloadBombFile(longId.slice(0, 4));

    return res.end(file);
};

export const createBomb: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (requester.isAdmin) throw ForbiddenError;

    const { labName } = new CreateBombRequest(req);

    const lab = await LabDAO.getByName(labName);
    if (!lab) throw NotFoundError;
    if (requester.isStudent && (!lab.isOpen || lab.isClosed))
        throw ForbiddenError;

    const longId = await createStringId(32, async text => {
        const bomb = await BombDAO.getById(text.slice(0, 4), true);
        return !!bomb;
    });
    const bombId = longId.slice(0, 4);

    const solutions = await createBombAndGetSolution(bombId, requester);

    const bomb = await BombDAO.create(longId, lab, requester, solutions);

    return res.send(toResponse(CreateBombResponse, bomb));
};
