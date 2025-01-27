import { DataSource } from 'typeorm';
import { Lab, SkeletonFile, User } from '../../../src/models';
import { UserRole } from '../../../src/lib/enums';
import { getChecksum } from '../../../src/lib/checksum';

export const taUser = {
    username: 'GlSkTa',
    secretKey: 'GlSkTaSecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'GlSkStudent',
    secretKey: 'GlSkStudentSecretKey',
    role: UserRole.STUDENT,
};

export const authorTaUser = {
    username: 'GlSkAuthorTa',
    secretKey: 'GlSkAuthorTaSecretKey',
    role: UserRole.TA,
};

export const labMocks = [
    {
        name: 'GlSkOpen',
        openAt: Date.now() - 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 2000 * 3600,
        authorUsername: 'GlSkAuthorTa',
        isDeleted: false,
    },
    {
        name: 'GlSkUnopen',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 2000 * 3600,
        closeAt: Date.now() + 3000 * 3600,
        authorUsername: 'GlSkAuthorTa',
        isDeleted: false,
    },
    {
        name: 'GlSkEmpty',
        openAt: Date.now() - 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 2000 * 3600,
        authorUsername: 'GlSkAuthorTa',
        isDeleted: false,
    },
    {
        name: 'GlSkDeleted',
        openAt: Date.now() - 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 2000 * 3600,
        authorUsername: 'GlSkAuthorTa',
        isDeleted: true,
    },
];

export const openLabSkeletonMocks = [
    {
        path: '/src/glsk_open.v',
        content: 'GlSkOpen.v Content',
        isExecutable: false,
        labName: 'GlSkOpen',
        isDeleted: false,
    },
    {
        path: '/src/glsk_open_deleted.v',
        content: 'GlSkOpen.v Deleted Content',
        isExecutable: false,
        labName: 'GlSkOpen',
        isDeleted: true,
    },
    {
        path: '/lib/executable.out',
        content: 'GlSkOpen.v Executable Content',
        isExecutable: true,
        labName: 'GlSkOpen',
        isDeleted: false,
    },
];

export const unopenLabSkeletonMocks = [
    {
        path: '/src/glsk_unopen.v',
        content: 'GlSkUnopen.v Content',
        isExecutable: false,
        labName: 'GlSkUnopen',
        isDeleted: false,
    },
    {
        path: '/src/glsk_unopen_deleted.v',
        content: 'GlSkUnopen.v Deleted Content',
        isExecutable: false,
        labName: 'GlSkUnopen',
        isDeleted: true,
    },
    {
        path: '/lib/executable.out',
        content: 'GlSkUnopen.v Executable Content',
        isExecutable: true,
        labName: 'GlSkUnopen',
        isDeleted: false,
    },
];

export const emptyLabSkeletonMocks = [
    {
        path: '/src/glsk_empty.v',
        content: 'GlSkEmpty.v Content',
        isExecutable: false,
        labName: 'GlSkEmpty',
        isDeleted: true,
    },
    {
        path: '/src/glsk_empty_deleted.v',
        content: 'GlSkEmpty.v Deleted Content',
        isExecutable: false,
        labName: 'GlSkEmpty',
        isDeleted: true,
    },
    {
        path: '/lib/executable.out',
        content: 'GlSkEmpty.v Executable Content',
        isExecutable: true,
        labName: 'GlSkEmpty',
        isDeleted: true,
    },
];

export const deletedLabSkeletonMocks = [
    {
        path: '/src/glsk_deleted.v',
        content: 'GlSkDeleted.v Content',
        isExecutable: false,
        labName: 'GlSkDeleted',
        isDeleted: false,
    },
    {
        path: '/src/glsk_deleted_deleted.v',
        content: 'GlSkDeleted.v Deleted Content',
        isExecutable: false,
        labName: 'GlSkDeleted',
        isDeleted: true,
    },
    {
        path: '/lib/executable.out',
        content: 'GlSkDeleted.v Executable Content',
        isExecutable: true,
        labName: 'GlSkDeleted',
        isDeleted: false,
    },
];

export const createUserMocks = async (
    dataSource: DataSource,
): Promise<User[]> => {
    const mocks = [taUser, studentUser, authorTaUser];
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
    return users;
};

export const createLabMocks = async (
    dataSource: DataSource,
    users: User[],
): Promise<Lab[]> => {
    const repo = dataSource.getRepository(Lab);
    const labs = repo.create(
        labMocks.map(lab => {
            const author = users.find(
                user => user.username === lab.authorUsername,
            );
            if (!author) throw new Error();
            return {
                ...lab,
                author,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                deletedAt: lab.isDeleted ? Date.now() : 0,
            };
        }),
    );
    await repo.save(labs);
    return labs;
};

export const createSkeletonMocks = async (
    dataSource: DataSource,
    labs: Lab[],
): Promise<SkeletonFile[]> => {
    const mocks = [
        ...openLabSkeletonMocks,
        ...unopenLabSkeletonMocks,
        ...emptyLabSkeletonMocks,
        ...deletedLabSkeletonMocks,
    ];
    const repo = dataSource.getRepository(SkeletonFile);
    const skeletons = repo.create(
        mocks.map(skeleton => {
            const lab = labs.find(l => l.name === skeleton.labName);
            if (!lab) throw new Error();
            return {
                ...skeleton,
                lab,
                checksum: getChecksum(skeleton.content),
                createdAt: Date.now(),
                deletedAt: skeleton.isDeleted ? Date.now() : 0,
            };
        }),
    );
    await repo.save(skeletons);
    return skeletons;
};
