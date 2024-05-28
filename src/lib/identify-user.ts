import { RequestHandler } from 'express';
import { NotFoundError, UnauthorizedError } from './http-errors';
import { UserDAO } from '../daos';

export const identifyUser: RequestHandler = async (req, res, next) => {
    if (!req.cookies) throw UnauthorizedError;

    const { username, secretKey } = req.cookies;
    if (!username || !secretKey) throw UnauthorizedError;

    const requester = await UserDAO.getByUsernameAndSecretKey(username, secretKey);
    if (!requester) throw NotFoundError;
    
    res.locals = { requester };

    return next();
}
