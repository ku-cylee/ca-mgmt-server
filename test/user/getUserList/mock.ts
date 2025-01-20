import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import User from '../../../src/models/user';

export const undeletedTAs = [
    {
        username: 'GetUserTA1',
        secretKey: 'GetUserTA1SecretKey',
        role: UserRole.TA,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        username: 'GetUserTA2',
        secretKey: 'GetUserTA2SecretKey',
        role: UserRole.TA,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
];

export const deletedTAs = [
    {
        username: 'GetUserTA3',
        secretKey: 'GetUserTA3SecretKey',
        role: UserRole.TA,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: Date.now(),
    },
    {
        username: 'GetUserTA4',
        secretKey: 'GetUserTA4SecretKey',
        role: UserRole.TA,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: Date.now(),
    },
];

export const undeletedStudents = [
    {
        username: 'GetUserStdnt1',
        secretKey: 'GetUserStdnt1SecretKey',
        role: UserRole.STUDENT,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        username: 'GetUserStdnt2',
        secretKey: 'GetUserStdnt2SecretKey',
        role: UserRole.STUDENT,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
];

export const deletedStudents = [
    {
        username: 'GetUserStdnt3',
        secretKey: 'GetUserStdnt3SecretKey',
        role: UserRole.STUDENT,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: Date.now(),
    },
    {
        username: 'GetUserStdnt4',
        secretKey: 'GetUserStdnt4SecretKey',
        role: UserRole.STUDENT,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: Date.now(),
    },
];

export const createMock = async (dataSource: DataSource) => {
    const mock = [
        ...undeletedTAs,
        ...deletedTAs,
        ...undeletedStudents,
        ...deletedStudents,
    ];
    const repo = dataSource.getRepository(User);
    const users = repo.create(mock);
    await repo.save(users);
};
