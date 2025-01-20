const name = 'HttpError';

export interface HttpError {
    name: string;
    code: number;
}

export const BadRequestError: HttpError = { name, code: 400 };

export const UnauthorizedError: HttpError = { name, code: 401 };

export const ForbiddenError: HttpError = { name, code: 403 };

export const NotFoundError: HttpError = { name, code: 404 };

export const ConflictError: HttpError = { name, code: 409 };

export const InternalServerError: HttpError = { name, code: 500 };
