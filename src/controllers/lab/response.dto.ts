import { Expose, Type } from 'class-transformer';
import { AuthorDTO } from '../../lib/dtos';

class SkeletonFileDTO {
    @Expose()
    id!: number;

    @Expose()
    path!: string;

    @Expose()
    createdAt!: number;
}

export class GetLabListResponse {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    openAt!: number;

    @Expose()
    dueDate!: number;

    @Expose()
    closeAt!: number;

    @Expose()
    submissionFiles!: string[];

    @Expose()
    @Type(() => AuthorDTO)
    author!: AuthorDTO;

    @Expose()
    createdAt!: number;

    @Expose()
    updatedAt!: number;

    @Expose()
    deletedAt!: number;
}

export class GetLabResponse {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    openAt!: number;

    @Expose()
    dueDate!: number;

    @Expose()
    closeAt!: number;

    @Expose()
    submissionFiles!: string[];

    @Expose()
    @Type(() => AuthorDTO)
    author!: AuthorDTO;

    @Expose()
    createdAt!: number;

    @Expose()
    updatedAt!: number;

    @Expose()
    deletedAt!: number;

    @Expose()
    @Type(() => SkeletonFileDTO)
    skeletonFiles!: SkeletonFileDTO[];
}

export class CreateLabResponse {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    openAt!: number;

    @Expose()
    dueDate!: number;

    @Expose()
    closeAt!: number;

    @Expose()
    submissionFiles!: string[];

    @Expose()
    @Type(() => AuthorDTO)
    author!: AuthorDTO;

    @Expose()
    createdAt!: number;

    @Expose()
    updatedAt!: number;

    @Expose()
    deletedAt!: number;
}

export class UpdateLabResponse {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    openAt!: number;

    @Expose()
    dueDate!: number;

    @Expose()
    closeAt!: number;

    @Expose()
    submissionFiles!: string[];

    @Expose()
    @Type(() => AuthorDTO)
    author!: AuthorDTO;

    @Expose()
    createdAt!: number;

    @Expose()
    updatedAt!: number;

    @Expose()
    deletedAt!: number;
}

export class UpdateSubmissionFilesResponse {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    openAt!: number;

    @Expose()
    dueDate!: number;

    @Expose()
    closeAt!: number;

    @Expose()
    submissionFiles!: string[];

    @Expose()
    @Type(() => AuthorDTO)
    author!: AuthorDTO;

    @Expose()
    createdAt!: number;

    @Expose()
    updatedAt!: number;

    @Expose()
    deletedAt!: number;
}
