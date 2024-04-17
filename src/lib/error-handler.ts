import { ErrorRequestHandler } from 'express';
import { BadRequestError, HttpError, InternalServerError } from './http-errors';
import logger from './logger';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const error = (() => {
        switch (err.name) {
            case 'HttpError':
                return <HttpError>err;
            case 'ValidationError':
                return BadRequestError;
            default:
                logger.error(err);
                return InternalServerError;
        }
    })();

    return res.status(error.code).send();
};

export default errorHandler;
