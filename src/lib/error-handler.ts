import { ErrorRequestHandler } from 'express';
import {
    BadRequestError,
    ConflictError,
    HttpError,
    InternalServerError,
} from './http-errors';
import logger from './logger';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const error = (() => {
        switch (err.name) {
            case 'HttpError':
                return <HttpError>err;
            case 'SyntaxError':
            case 'ValidationError':
                return BadRequestError;
            case 'QueryFailedError':
                if (err.code === 'ER_DUP_ENTRY') return ConflictError;
                return InternalServerError;
            default:
                logger.error(err);
                return InternalServerError;
        }
    })();

    return res.status(error.code).send();
};

export default errorHandler;
