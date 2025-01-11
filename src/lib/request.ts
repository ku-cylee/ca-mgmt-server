import Joi from 'joi';
import { UserRole } from './enums';

class Schemes {
    integer = Joi.number().integer();

    string = Joi.string().trim();

    bool = Joi.boolean();

    id = this.integer.min(1);

    username = this.string.max(16);

    secretKey = this.string.max(64);

    userRole = this.string.valid(UserRole.TA, UserRole.STUDENT);

    userRoleRequired = this.string
        .required()
        .valid(UserRole.TA, UserRole.STUDENT);
}

export default class RequestDTO {
    validate = Joi.attempt;

    schemes = new Schemes();
}
