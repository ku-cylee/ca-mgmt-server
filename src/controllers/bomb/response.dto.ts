import { Expose, Type } from 'class-transformer';
import { AuthorDTO } from '../../lib/dtos';

export class GetBombListResponse {
    @Expose()
    id!: number;

    @Expose({ groups: ['admin', 'ta'] })
    @Type(() => AuthorDTO)
    author!: AuthorDTO;

    @Expose({ groups: ['admin', 'ta'] })
    solutions!: string[];

    @Expose()
    maxPhase!: number;

    @Expose()
    explosions!: number;

    @Expose()
    createdAt!: number;

    @Expose()
    lastSubmittedAt!: number;
}

export class CreateBombResponse {
    @Expose()
    id!: string;

    @Expose()
    longId!: string;

    @Expose()
    createdAt!: number;
}
