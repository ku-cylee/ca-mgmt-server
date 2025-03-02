import { Request } from 'express';
import { schemes, validate } from '../../lib/dtos';
import Joi from 'joi';

export class GetDefuseListRequest {
    bombId!: string;

    constructor(req: Request) {
        const { bombId } = req.query;

        this.bombId = validate(bombId, schemes.string.trim().max(4).required());
    }
}

export class CreateDefuseRequest {
    bombId!: string;

    phase!: number;

    answer!: string;

    defused!: boolean;

    constructor(req: Request) {
        const { bombId } = req.query;
        const { phase, answer, defused } = req.body;

        this.bombId = validate(bombId, schemes.string.max(16).required());
        this.phase = validate(phase, schemes.integer.min(1).max(7).required());
        this.answer = validate(answer, Joi.string().required());
        this.defused = validate(defused, schemes.bool.required());
    }
}
