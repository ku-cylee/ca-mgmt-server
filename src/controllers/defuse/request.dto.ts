import { Request } from 'express';
import { schemes, validate } from '../../lib/dtos';

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

    constructor(req: Request) {
        const { bombId, phase, answer } = req.body;

        this.bombId = validate(bombId, schemes.string.max(16).required());
        this.phase = validate(phase, schemes.integer.min(1).max(6).required());
        this.answer = validate(answer, schemes.string.required());
    }
}
