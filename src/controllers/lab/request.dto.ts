import { Request } from 'express';
import { schemes, validate } from '../../lib/dtos';
import { BadRequestError } from '../../lib/http-errors';

export class GetLabRequest {
    labName!: string;

    constructor(req: Request) {
        const { labName } = req.params;

        this.labName = validate(labName, schemes.string);
    }
}

export class CreateLabRequest {
    name!: string;

    openAt!: number;

    dueDate!: number;

    closeAt!: number;

    constructor(req: Request) {
        const { name, openAt, dueDate, closeAt } = req.body;

        this.name = validate(name, schemes.labName.required());
        this.openAt = validate(openAt, schemes.integer.required());
        this.dueDate = validate(dueDate, schemes.integer.required());
        this.closeAt = validate(closeAt, schemes.integer.required());

        if (this.openAt >= this.dueDate || this.dueDate > this.closeAt)
            throw BadRequestError;
    }
}

export class UpdateLabRequest {
    labName!: string;

    name!: string;

    openAt!: number;

    dueDate!: number;

    closeAt!: number;

    constructor(req: Request) {
        const { labName } = req.params;
        const { name, openAt, dueDate, closeAt } = req.body;

        this.labName = validate(labName, schemes.labName.required());
        this.name = validate(name, schemes.labName.required());
        this.openAt = validate(openAt, schemes.integer.required());
        this.dueDate = validate(dueDate, schemes.integer.required());
        this.closeAt = validate(closeAt, schemes.integer.required());

        if (this.openAt >= this.dueDate || this.dueDate > this.closeAt)
            throw BadRequestError;
    }
}

export class UpdateSubmissionFilesRequest {
    labName!: string;

    submissionFiles!: string[];

    constructor(req: Request) {
        const { labName } = req.params;
        const { submissionFiles } = req.body;

        this.labName = validate(labName, schemes.labName.required());
        this.submissionFiles = validate(
            submissionFiles,
            schemes.submissionFiles.required(),
        );
    }
}

export class DeleteLabRequest {
    labName!: string;

    constructor(req: Request) {
        const { labName } = req.params;

        this.labName = validate(labName, schemes.labName.required());
    }
}
