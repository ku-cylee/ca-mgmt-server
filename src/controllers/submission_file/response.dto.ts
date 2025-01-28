import { Expose } from 'class-transformer';

export class CreateSubmissionFileListResponse {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    createdAt!: number;
}
