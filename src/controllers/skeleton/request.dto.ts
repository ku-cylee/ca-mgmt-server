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

    isExecutable!: boolean;

    constructor(req: Request) {
        const { labName } = req.query;
        const { path, content, isExecutable } = req.body;

        this.labName = validate(labName, schemes.labName.required());
        this.path = validate(path, schemes.string.max(256).required());
        this.content = validate(content, Joi.string().max(65536).required());
        this.isExecutable = validate(isExecutable, schemes.bool.required());
    }
}

export class DeleteSkeletonRequest {
    labName!: string;

    constructor(req: Request) {
        const { labName } = req.query;

        this.labName = validate(labName, schemes.labName.required());
    }
}
