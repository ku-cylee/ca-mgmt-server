import { Request } from 'express';
import { schemes, validate } from '../../lib/dtos';

export class GetBombListRequest {
    authorName!: string | undefined;

    labName!: string | undefined;

    constructor(req: Request) {
        const { author, labName } = req.query;

        this.authorName = validate(author, schemes.username);
        this.labName = validate(labName, schemes.labName);
    }
}

export class GetBombFileByIdRequest {
    bombId!: string;

    constructor(req: Request) {
        const { bombId } = req.params;

        this.bombId = validate(bombId, schemes.string.max(4).required());
    }
}

export class GetBombFileByLongIdRequest {
    longId!: string;

    constructor(req: Request) {
        const { longId } = req.params;

        this.longId = validate(longId, schemes.string.max(32).required());
    }
}

export class CreateBombRequest {
    labName!: string;

    constructor(req: Request) {
        const { labName } = req.query;

        this.labName = validate(labName, schemes.labName.required());
    }
}
