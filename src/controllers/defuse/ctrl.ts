import { RequestHandler } from 'express';
import { toResponse } from '../../lib/dtos';
import { BombDAO, DefuseDAO } from '../../daos';
import { CreateDefuseRequest, GetDefuseListRequest } from './request.dto';
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
} from '../../lib/http-errors';
import { CreateDefuseResponse, GetDefuseListResponse } from './response.dto';

export const getDefuseList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;

    const { bombId } = new GetDefuseListRequest(req);

    const bomb = await BombDAO.getById(bombId, requester.isAdmin);
    if (!bomb) throw NotFoundError;
    if (requester.isStudent && !bomb.author.is(requester)) throw ForbiddenError;
    if (requester.isStudent && !bomb.lab.isOpen) throw ForbiddenError;

    const defuses = await DefuseDAO.getListByBomb(bomb);

    return res.send(toResponse(GetDefuseListResponse, defuses));
};

export const createDefuse: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (requester.isAdmin) throw ForbiddenError;

    const { bombId, phase, answer, defused } = new CreateDefuseRequest(req);

    const bomb = await BombDAO.getById(bombId);
    if (!bomb) throw NotFoundError;
    if (requester.isStudent && !bomb.author.is(requester)) throw ForbiddenError;
    if (requester.isStudent && (!bomb.lab.isOpen || bomb.lab.isClosed))
        throw ForbiddenError;

    const exploded = answer !== bomb.getSolution(phase);

    // TODO
    // Improve deceiving case
    // Report this case.
    if (exploded === defused) throw ConflictError;

    const defuse = await DefuseDAO.create(bomb, phase, answer, exploded);

    return res.send(toResponse(CreateDefuseResponse, defuse));
};
