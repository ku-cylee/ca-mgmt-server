import { Expose, Type } from 'class-transformer';
import { AuthorDTO } from '../../lib/dtos';

class LabDTO {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    deletedAt!: number;
}

class FileDTO {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    @Type(() => LabDTO)
    lab!: LabDTO;

    @Expose()
    deletedAt!: number;
}

export class GetSubmissionListResponse {
    @Expose()
    id!: number;

    @Expose()
    @Type(() => AuthorDTO)
    author!: AuthorDTO;

    @Expose()
    @Type(() => FileDTO)
    file!: FileDTO;

    @Expose()
    content!: string;

    @Expose()
    checksum!: string;

    @Expose()
    createdAt!: number;

    @Expose()
    deletedAt!: number;
}

export class CreateSubmissionResponse {
    @Expose()
    id!: number;

    @Expose()
    checksum!: string;
}
