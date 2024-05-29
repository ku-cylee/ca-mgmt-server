import { RequestHandler } from 'express';
import { NotFoundError } from '../lib/http-errors';

export const handleUndefinedRoute: RequestHandler = async (
    req,
    _res,
    _next,
) => {
    if (!req.route) throw NotFoundError;
};
