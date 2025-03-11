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

export class GetBombFileByLongIdRequest {
    bombLongId!: string;

    constructor(req: Request) {
        const { bombLongId } = req.params;

        this.bombLongId = validate(
            bombLongId,
            schemes.string.max(32).required(),
        );
    }
}

export class CreateBombRequest {
    labName!: string;

    constructor(req: Request) {
        const { labName } = req.query;

        this.labName = validate(labName, schemes.labName.required());
    }
}
