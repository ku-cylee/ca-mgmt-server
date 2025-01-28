import { Request } from 'express';
import Joi from 'joi';
import { schemes, validate } from '../../lib/dtos';

export class CreateSubmissionFileListRequest {
    labName!: string;

    names!: string[];

    constructor(req: Request) {
        const { labName } = req.query;
        const { names } = req.body;

        this.labName = validate(labName, schemes.labName.required());
        this.names = validate(
            names,
            Joi.array().items(schemes.submissionFilename).required(),
        );
    }
}
