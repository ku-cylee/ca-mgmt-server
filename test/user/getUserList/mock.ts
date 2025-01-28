import { UserRole } from '../../../src/lib/enums';
import { User } from '../../../src/models';
import { dataSource } from '../database';

export const undeletedTAs = [
    {
        username: 'GetUserTA1',
        secretKey: 'GetUserTA1SecretKey',
        role: UserRole.TA,
        isDeleted: false,
    },
    {
        username: 'GetUserTA2',
        secretKey: 'GetUserTA2SecretKey',
        role: UserRole.TA,
        isDeleted: false,
    },
];

export const deletedTAs = [
    {
        username: 'GetUserTA3',
        secretKey: 'GetUserTA3SecretKey',
        role: UserRole.TA,
        isDeleted: true,
    },
    {
        username: 'GetUserTA4',
        secretKey: 'GetUserTA4SecretKey',
        role: UserRole.TA,
        isDeleted: true,
    },
];

export const undeletedStudents = [
    {
        username: 'GetUserStdnt1',
        secretKey: 'GetUserStdnt1SecretKey',
        role: UserRole.STUDENT,
        isDeleted: false,
    },
    {
        username: 'GetUserStdnt2',
        secretKey: 'GetUserStdnt2SecretKey',
        role: UserRole.STUDENT,
        isDeleted: false,
    },
];

export const deletedStudents = [
    {
        username: 'GetUserStdnt3',
        secretKey: 'GetUserStdnt3SecretKey',
        role: UserRole.STUDENT,
        isDeleted: true,
    },
    {
        username: 'GetUserStdnt4',
        secretKey: 'GetUserStdnt4SecretKey',
        role: UserRole.STUDENT,
        isDeleted: true,
    },
];

export const createMocks = async () => {
    const mocks = [
        ...undeletedTAs,
        ...deletedTAs,
        ...undeletedStudents,
        ...deletedStudents,
    ];
    const repo = dataSource.getRepository(User);
    const users = repo.create(
        mocks.map(user => {
            return {
                ...user,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                deletedAt: user.isDeleted ? Date.now() : 0,
            };
        }),
    );
    await repo.save(users);
};
