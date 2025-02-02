import { Expose, Type } from 'class-transformer';
import { AuthorDTO } from '../../lib/dtos';

class BombDTO {
    @Expose()
    id!: string;

    @Expose()
    author!: AuthorDTO;

    @Expose()
    createdAt!: number;
}

export class GetDefuseListResponse {
    @Expose()
    id!: number;

    @Expose()
    @Type(() => BombDTO)
    bomb!: BombDTO;

    @Expose()
    phase!: number;

    @Expose()
    answer!: string;

    @Expose()
    exploded!: boolean;

    @Expose()
    createdAt!: number;
}

export class CreateDefuseResponse {
    @Expose()
    exploded!: boolean;
}
