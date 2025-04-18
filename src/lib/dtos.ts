import { ClassConstructor, Expose, plainToInstance } from 'class-transformer';
import Joi from 'joi';
import { UserRole } from './enums';

class Schemes {
    integer = Joi.number().integer();

    string = Joi.string().trim();

    bool = Joi.boolean();

    id = this.integer.min(1);

    username = this.string.max(16).pattern(/^[a-zA-Z0-9-]+$/);

    secretKey = this.string.max(64);

    userRole = this.string.valid(UserRole.TA, UserRole.STUDENT);

    userRoleRequired = this.string
        .required()
        .valid(UserRole.TA, UserRole.STUDENT);

    labName = this.string.max(32).pattern(/^[a-zA-Z0-9-]+$/);

    submissionFilename = this.string.max(32);
}

export const schemes = new Schemes();

export const validate = Joi.attempt;

export const toResponse = <T, V>(
    cls: ClassConstructor<T>,
    plain: V | V[],
    groups: string[] = [],
): T | T[] =>
    plainToInstance(cls, plain, { groups, excludeExtraneousValues: true });

export class AuthorDTO {
    @Expose()
    username!: string;
}
