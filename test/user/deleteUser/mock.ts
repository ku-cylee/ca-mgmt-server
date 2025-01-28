import { UserRole } from '../../../src/lib/enums';
import { User } from '../../../src/models';
import { dataSource } from '../database';

export const taUser = {
    username: 'DUserTA',
    secretKey: 'DUserTASecretKey',
    role: UserRole.TA,
    isDeleted: false,
};

export const studentUser = {
    username: 'DUserStdnt',
    secretKey: 'DUserStdntSecretKey',
    role: UserRole.STUDENT,
    isDeleted: false,
};

export const userMocks = [
    {
        username: 'DUserExist',
        role: UserRole.TA,
        isDeleted: false,
    },
    {
        username: 'DUserDeleted',
        role: UserRole.TA,
        isDeleted: true,
    },
    {
        username: 'DUserAdmin',
        role: UserRole.ADMIN,
        isDeleted: false,
    },
    {
        username: 'DUserDelTa',
        role: UserRole.STUDENT,
        isDeleted: false,
    },
    {
        username: 'DUserDelStudent',
        role: UserRole.STUDENT,
        isDeleted: false,
    },
];

export const createMocks = async () => {
    const mocks = [taUser, studentUser, ...userMocks];
    const repo = dataSource.getRepository(User);
    const users = repo.create(
        mocks.map(user => {
            const { username, isDeleted } = user;
            return {
                ...user,
                secretKey: `${username}SecretKey`,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                deletedAt: isDeleted ? Date.now() : 0,
            };
        }),
    );
    await repo.save(users);
};
