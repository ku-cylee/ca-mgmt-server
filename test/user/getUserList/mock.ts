import { UserRole } from '../../../src/lib/enums';
import { User } from '../../../src/models';
import { dataSource } from '../database';

export const undeletedTAs = [
    {
        username: 'GlUserTaUnd1',
        secretKey: 'GlUserTaUnd1SecretKey',
        role: UserRole.TA,
        isDeleted: false,
    },
    {
        username: 'GlUserTaUnd2',
        secretKey: 'GlUserTaUnd2SecretKey',
        role: UserRole.TA,
        isDeleted: false,
    },
];

export const deletedTAs = [
    {
        username: 'GlUserTaDel1',
        secretKey: 'GlUserTaDel1SecretKey',
        role: UserRole.TA,
        isDeleted: true,
    },
    {
        username: 'GlUserTaDel2',
        secretKey: 'GlUserTaDel2SecretKey',
        role: UserRole.TA,
        isDeleted: true,
    },
];

export const undeletedStudents = [
    {
        username: 'GlUserStdntUnd1',
        secretKey: 'GlUserStdntUnd1SecretKey',
        role: UserRole.STUDENT,
        isDeleted: false,
    },
    {
        username: 'GlUserStdntUnd2',
        secretKey: 'GlUserStdntUnd2SecretKey',
        role: UserRole.STUDENT,
        isDeleted: false,
    },
];

export const deletedStudents = [
    {
        username: 'GlUserStdntDel1',
        secretKey: 'GlUserStdntDel1SecretKey',
        role: UserRole.STUDENT,
        isDeleted: true,
    },
    {
        username: 'GlUserStdntDel2',
        secretKey: 'GlUserStdntDel2SecretKey',
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
