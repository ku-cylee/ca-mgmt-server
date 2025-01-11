import { Expose } from 'class-transformer';
import { UserRole } from '../../lib/enums';

export class GetUserListResponse {
    @Expose()
    id!: number;

    @Expose()
    username!: string;

    @Expose()
    role!: UserRole;

    @Expose()
    createdAt!: number;

    @Expose()
    updatedAt!: number;

    @Expose()
    deletedAt!: number;
}
