import { RequestHandler } from 'express';
import { toResponse } from '../../lib/dtos';
import { CreateBombRequest, GetBombListRequest } from './request.dto';
import { ForbiddenError, NotFoundError } from '../../lib/http-errors';
import { BombDAO, LabDAO, UserDAO } from '../../daos';
import { CreateBombResponse, GetBombListResponse } from './response.dto';
import { getChecksum } from '../../lib/checksum';

const MAX_GRADING_PHASE = parseInt(process.env.MAX_GRADING_PHASE ?? '5', 10);

export const getBombList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;

    const { authorName, labName } = new GetBombListRequest(req);

    if (requester.isStudent && requester.username !== authorName)
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
        const summary = bomb.defuseTrials.reduce(
            (acc, cur) => {
                const { maxPhase, explosions } = acc;
                const { phase, exploded } = cur;

                if (phase > MAX_GRADING_PHASE) return acc;
                return {
                    maxPhase: exploded ? maxPhase : Math.max(maxPhase, phase),
                    explosions: explosions + (exploded ? 1 : 0),
                };
            },
            { maxPhase: 0, explosions: 0 },
        );
        return { ...bomb, ...summary };
    });

    return res.send(toResponse(GetBombListResponse, bombsWithDefuseSummary));
};

export const createBomb: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (requester.isAdmin) throw ForbiddenError;

    const { labName } = new CreateBombRequest(req);

    const lab = await LabDAO.getByName(labName);
    if (!lab) throw NotFoundError;
    if (requester.isStudent && (!lab.isOpen || lab.isClosed))
        throw ForbiddenError;

    const longId = await (async () => {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const hash = getChecksum(Date.now().toString(), 32);
            // eslint-disable-next-line no-await-in-loop
            const bomb = await BombDAO.getById(hash.slice(0, 4), true);
            if (!bomb) return hash;
        }
    })();

    // Get Bomb. To be implemented
    const answers = ['', '', '', '', '', ''];

    const bomb = await BombDAO.create(longId, lab, requester, answers);

    return res.send(toResponse(CreateBombResponse, bomb));
};
