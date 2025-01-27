import { Request } from 'express';
import Joi from 'joi';
import { schemes, validate } from '../../lib/dtos';

export class GetSkeletonListRequest {
    labName!: string;

    constructor(req: Request) {
        const { labName } = req.query;

        this.labName = validate(labName, schemes.labName.required());
    }
}

export class CreateSkeletonRequest {
    labName!: string;

    path!: string;

    content!: string;

    checksum!: string;

    isExecutable!: boolean;

    constructor(req: Request) {
        const { labName } = req.query;
        const { path, content, checksum, isExecutable } = req.body;

        this.labName = validate(labName, schemes.labName.required());
        this.path = validate(path, schemes.string.max(128).required());
        this.content = validate(content, Joi.string().max(65536).required());
        this.checksum = validate(checksum, schemes.string.max(16).required());
        this.isExecutable = validate(isExecutable, schemes.bool.required());
    }
}

export class DeleteSkeletonListRequest {
    labName!: string;

    constructor(req: Request) {
        const { labName } = req.query;

        this.labName = validate(labName, schemes.labName.required());
    }
}
