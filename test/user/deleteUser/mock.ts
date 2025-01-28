import { UserRole } from '../../../src/lib/enums';
import { User } from '../../../src/models';
import { dataSource } from '../database';

export const taUser = {
    username: 'DeleteUserTA',
    secretKey: 'DeleteUserTASecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'DeleteUserStdnt',
    secretKey: 'DeleteUserStdntSecretKey',
    role: UserRole.STUDENT,
};

export const createMocks = async () => {
    const mocks = [taUser, studentUser];
    const repo = dataSource.getRepository(User);
    const users = repo.create(
        mocks.map(user => {
            return {
                ...user,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        }),
    );
    await repo.save(users);
};
