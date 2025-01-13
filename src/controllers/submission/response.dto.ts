import { Expose, Type } from 'class-transformer';
import { AuthorDTO } from '../../lib/dtos';

export class GetSubmissionListResponse {
    @Expose()
    id!: number;

    @Expose()
    labId!: number;

    @Expose()
    @Type(() => AuthorDTO)
    author!: AuthorDTO;

    @Expose()
    filename!: string;

    @Expose()
    content!: string;

    @Expose()
    checksum!: string;

    @Expose()
    createdAt!: number;

    @Expose()
    updatedAt!: number;
}

export class CreateSubmissionResponse {
    @Expose()
    id!: number;

    @Expose()
    checksum!: string;
}
