import { RequestHandler } from 'express';
import { UserDAO } from '../../daos';
import {
    CreateUserListRequest,
    DeleteUserRequest,
    GetUserListRequest,
} from './request.dto';
import { NotFoundError, ForbiddenError } from '../../lib/http-errors';
import { GetUserListResponse } from './response.dto';
import { toResponse } from '../../lib/dtos';

export const getUserList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (requester.isStudent) throw ForbiddenError;

    const { ta, student, deleted } = new GetUserListRequest(req);
    if (requester.isTA && deleted) throw ForbiddenError;

    const users = await UserDAO.getList(ta, student, deleted);

    return res.send(toResponse(GetUserListResponse, users));
};

export const createUserList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (!requester.isAdmin) throw ForbiddenError;

    const { role, usersData } = new CreateUserListRequest(req);

    await UserDAO.createList(role, usersData);

    return res.send();
};

export const deleteUser: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    const { username } = new DeleteUserRequest(req);

    if (!requester.isAdmin) throw ForbiddenError;

    const user = await UserDAO.getByUsername(username);
    if (!user) throw NotFoundError;
    if (user.isAdmin) throw ForbiddenError;

    await UserDAO.deleteById(user.id);

    return res.send();
};
