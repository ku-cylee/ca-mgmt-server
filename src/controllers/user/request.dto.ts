import { Request } from 'express';
import Joi from 'joi';
import RequestDTO from '../../lib/request';
import { stringToEnum, UserRole } from '../../lib/enums';
import { BadRequestError } from '../../lib/http-errors';

export class GetUserListRequest extends RequestDTO {
    ta!: boolean;

    student!: boolean;

    deleted!: boolean;

    constructor(req: Request) {
        super();

        const { ta, student, deleted } = req.query;

        this.ta = this.validate(ta, this.schemes.bool.required());
        this.student = this.validate(student, this.schemes.bool.required());
        this.deleted = this.validate(deleted, this.schemes.bool.default(false));
    }
}

export class CreateUserListRequest extends RequestDTO {
    role!: UserRole;

    usersData!: { username: string; secretKey: string }[];

    constructor(req: Request) {
        super();

        const { role, usersData } = req.body;

        const roleEnum = stringToEnum(
            UserRole,
            this.validate(role, this.schemes.userRole),
        );
        if (!roleEnum) throw BadRequestError;

        this.role = roleEnum;

        this.usersData = this.validate(
            usersData,
            Joi.array()
                .items({
                    username: this.schemes.username.required(),
                    secretKey: this.schemes.secretKey.required(),
                })
                .required(),
        );
    }
}

export class DeleteUserListRequest extends RequestDTO {
    userId!: number;

    constructor(req: Request) {
        super();

        const { userId } = req.params;

        this.userId = this.validate(userId, this.schemes.id.required());
    }
}
