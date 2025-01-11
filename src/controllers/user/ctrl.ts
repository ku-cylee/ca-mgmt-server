import { RequestHandler } from 'express';
import { UserDAO } from '../../daos';
import {
    CreateUserListRequest,
    DeleteUserListRequest,
    GetUserListRequest,
} from './request.dto';
import { NotFoundError, PermissionDeniedError } from '../../lib/http-errors';
import { GetUserListResponse } from './response.dto';
import { toResponse } from '../../lib/dtos';

export const getUserList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (requester.isStudent) throw PermissionDeniedError;

    const { ta, student, deleted } = new GetUserListRequest(req);
    if (requester.isTA && deleted) throw PermissionDeniedError;

    const users = await UserDAO.getList(ta, student, deleted);

    return res.send(toResponse(GetUserListResponse, users));
};

export const createUserList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (!requester.isAdmin) throw PermissionDeniedError;

    const { role, usersData } = new CreateUserListRequest(req);

    await UserDAO.createList(role, usersData);

    return res.send();
};

export const deleteUser: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    const { userId } = new DeleteUserListRequest(req);

    if (!requester.isAdmin) throw PermissionDeniedError;

    const deletedUserCount = await UserDAO.deleteById(userId);

    if (!deletedUserCount) throw NotFoundError;

    return res.send();
};
