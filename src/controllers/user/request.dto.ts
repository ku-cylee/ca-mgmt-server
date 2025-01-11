import { Request } from 'express';
import Joi from 'joi';
import { stringToEnum, UserRole } from '../../lib/enums';
import { BadRequestError } from '../../lib/http-errors';
import { schemes, validate } from '../../lib/dtos';

export class GetUserListRequest {
    ta!: boolean;

    student!: boolean;

    deleted!: boolean;

    constructor(req: Request) {
        const { ta, student, deleted } = req.query;

        this.ta = validate(ta, schemes.bool.required());
        this.student = validate(student, schemes.bool.required());
        this.deleted = validate(deleted, schemes.bool.default(false));
    }
}

export class CreateUserListRequest {
    role!: UserRole;

    usersData!: { username: string; secretKey: string }[];

    constructor(req: Request) {
        const { role, usersData } = req.body;

        const roleEnum = stringToEnum(
            UserRole,
            validate(role, schemes.userRole),
        );
        if (!roleEnum) throw BadRequestError;

        this.role = roleEnum;

        this.usersData = validate(
            usersData,
            Joi.array()
                .items({
                    username: schemes.username.required(),
                    secretKey: schemes.secretKey.required(),
                })
                .required(),
        );
    }
}

export class DeleteUserListRequest {
    userId!: number;

    constructor(req: Request) {
        const { userId } = req.params;

        this.userId = validate(userId, schemes.id.required());
    }
}
