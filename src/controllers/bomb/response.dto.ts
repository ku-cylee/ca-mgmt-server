import { Expose, Type } from 'class-transformer';
import { AuthorDTO } from '../../lib/dtos';

export class GetBombListResponse {
    @Expose()
    id!: number;

    @Expose()
    @Type(() => AuthorDTO)
    author!: AuthorDTO;

    @Expose()
    maxPhase!: number;

    @Expose()
    explosions!: number;

    @Expose()
    createdAt!: number;
}

export class CreateBombResponse {
    @Expose()
    id!: string;

    @Expose()
    longId!: string;

    @Expose()
    createdAt!: number;
}
