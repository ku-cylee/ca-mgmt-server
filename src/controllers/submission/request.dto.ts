import { Request } from 'express';
import Joi from 'joi';
import { schemes, validate } from '../../lib/dtos';

export class GetSubmissionListRequest {
    content!: boolean;

    authorUsername!: string | undefined;

    labName!: string | undefined;

    constructor(req: Request) {
        const { content, author, labName } = req.query;

        this.content = validate(content, schemes.bool.required());
        this.authorUsername = validate(author, schemes.username) ?? undefined;
        this.labName = validate(labName, schemes.labName ?? undefined);
    }
}

export class CreateSubmissionRequest {
    labName!: string;

    filename!: string;

    content!: string;

    constructor(req: Request) {
        const { labName } = req.query;
        const { filename, content } = req.body;

        this.filename = validate(labName, schemes.labName.required());
        this.filename = validate(filename, schemes.string.max(256).required());
        this.content = validate(content, Joi.string().max(65536).required());
    }
}
