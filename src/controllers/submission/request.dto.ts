import { Request } from 'express';
import Joi from 'joi';
import { schemes, validate } from '../../lib/dtos';

export class GetSubmissionListRequest {
    content!: boolean;

    authorName!: string | undefined;

    labName!: string | undefined;

    constructor(req: Request) {
        const { content, author, labName } = req.query;

        this.content = validate(content, schemes.bool.default(false));
        this.authorName = validate(author, schemes.username);
        this.labName = validate(labName, schemes.labName);
    }
}

export class CreateSubmissionRequest {
    labName!: string;

    fileName!: string;

    content!: string;

    checksum!: string;

    createdAt!: number;

    constructor(req: Request) {
        const { labName, fileName } = req.query;
        const { content, checksum, createdAt } = req.body;

        this.labName = validate(labName, schemes.labName.required());
        this.fileName = validate(
            fileName,
            schemes.submissionFilename.required(),
        );
        this.content = validate(content, Joi.string().max(65536).required());
        this.checksum = validate(checksum, schemes.string.max(16).required());
        this.createdAt = validate(createdAt, schemes.integer.required());
    }
}
