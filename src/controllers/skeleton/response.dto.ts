import { Expose } from 'class-transformer';

export class GetSkeletonListResponse {
    @Expose()
    id!: number;

    @Expose()
    labId!: number;

    @Expose()
    path!: string;

    @Expose()
    content!: string;

    @Expose()
    checksum!: string;

    @Expose()
    isExecutable!: boolean;

    @Expose()
    createdAt!: number;
}

export class CreateSkeletonResponse {
    @Expose()
    id!: number;

    @Expose()
    checksum!: string;

    @Expose()
    createdAt!: number;
}
