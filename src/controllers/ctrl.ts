import { RequestHandler } from 'express';
import { NotFoundError } from '../lib/http-errors';

export const handleUndefinedRoute: RequestHandler = async req => {
    if (!req.route) throw NotFoundError;
};
