import { UserRole } from '../../../src/lib/enums';
import { User } from '../../../src/models';
import { dataSource } from '../database';

export const taUser = {
    username: 'CreateUserTA',
    secretKey: 'CreateUserTASecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'CreateUserStdnt',
    secretKey: 'CreateUserStdntSecretKey',
    role: UserRole.STUDENT,
};

export const duplicateUser = {
    username: 'CreateUserDup',
    secretKey: 'CreateUserDupSecretKey',
    role: UserRole.TA,
};

export const createMocks = async () => {
    const mocks = [taUser, studentUser, duplicateUser];
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
