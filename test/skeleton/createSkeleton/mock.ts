import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import { Lab, SkeletonFile, User } from '../../../src/models';
import { getChecksum } from '../../../src/lib/checksum';

export const taUser = {
    username: 'CSkelTa',
    secretKey: 'CSkelTaSecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'CSkelStudent',
    secretKey: 'CSkelStudentSecretKey',
    role: UserRole.STUDENT,
};

export const otherTaUser = {
    username: 'CSkelOtherTa',
    secretKey: 'CSkelOtherTaSecretKey',
    role: UserRole.TA,
};

export const labMocks = [
    {
        name: 'CSkelUndeleted',
        isDeleted: false,
    },
    {
        name: 'CSkelDeleted',
        isDeleted: true,
    },
    {
        name: 'CSkelBadRequest',
        isDeleted: false,
    },
    {
        name: 'CSkelDuplicate',
        isDeleted: false,
    },
    {
        name: 'CSkelOne',
        isDeleted: false,
    },
    {
        name: 'CSkelAnother',
        isDeleted: false,
    },
    {
        name: 'CSkelChecksum',
        isDeleted: false,
    },
];

export const undeletedLabSkeletonMocks = [
    {
        path: '/src/cskel_undeleted.v',
        content: 'CSkelUndeleted.v Content',
        isExecutable: false,
        labName: 'CSkelUndeleted',
        isDeleted: false,
    },
    {
        path: '/src/cskel_undeleted_deleted.v',
        content: 'CSkelUndeleted.v Deleted Content',
        isExecutable: false,
        labName: 'CSkelUndeleted',
        isDeleted: true,
    },
];

export const deletedLabSkeletonMocks = [
    {
        path: '/src/cskel_deleted.v',
        content: 'CSkelDeleted.v Content',
        isExecutable: false,
        labName: 'CSkelDeleted',
        isDeleted: false,
    },
    {
        path: '/src/cskel_deleted_deleted.v',
        content: 'CSkelDeleted.v Deleted Content',
        isExecutable: false,
        labName: 'CSkelDeleted',
        isDeleted: true,
    },
];

export const badRequestLabSkeletonMocks = [
    {
        path: '/src/cskel_badRequest.v',
        content: 'CSkelBadRequest.v Content',
        isExecutable: false,
        labName: 'CSkelBadRequest',
        isDeleted: false,
    },
    {
        path: '/src/cskel_badRequest_deleted.v',
        content: 'CSkelBadRequest.v Deleted Content',
        isExecutable: false,
        labName: 'CSkelBadRequest',
        isDeleted: true,
    },
];

export const duplicateLabSkeletonMocks = [
    {
        path: '/src/cskel_duplicate.v',
        content: 'CSkelDuplicate.v Content',
        isExecutable: false,
        labName: 'CSkelDuplicate',
        isDeleted: false,
    },
    {
        path: '/src/cskel_duplicate_deleted.v',
        content: 'CSkelDuplicate.v Deleted Content',
        isExecutable: false,
        labName: 'CSkelDuplicate',
        isDeleted: true,
    },
];

export const anotherLabSkeletonMocks = [
    {
        path: '/src/cskel_another.v',
        content: 'CSkelAnother.v Content',
        isExecutable: false,
        labName: 'CSkelAnother',
        isDeleted: false,
    },
    {
        path: '/src/cskel_another_deleted.v',
        content: 'CSkelAnother.v Deleted Content',
        isExecutable: false,
        labName: 'CSkelAnother',
        isDeleted: true,
    },
];

export const checksumLabSkeletonMocks = [
    {
        path: '/src/cskel_checksum.v',
        content: 'CSkelChecksum.v Content',
        isExecutable: false,
        labName: 'CSkelChecksum',
        isDeleted: false,
    },
    {
        path: '/src/cskel_checksum_deleted.v',
        content: 'CSkelChecksum.v Deleted Content',
        isExecutable: false,
        labName: 'CSkelChecksum',
        isDeleted: true,
    },
];

export const createUserMocks = async (
    dataSource: DataSource,
): Promise<User[]> => {
    const mocks = [taUser, studentUser, otherTaUser];
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
    const author = users.find(user => user.username === 'CSkelTa');
    const labs = repo.create(
        labMocks.map(lab => {
            return {
                ...lab,
                openAt: Date.now() + 1000 * 3600,
                dueDate: Date.now() + 2000 * 3600,
                closeAt: Date.now() + 3000 * 3600,
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
        ...undeletedLabSkeletonMocks,
        ...deletedLabSkeletonMocks,
        ...badRequestLabSkeletonMocks,
        ...duplicateLabSkeletonMocks,
        ...anotherLabSkeletonMocks,
        ...checksumLabSkeletonMocks,
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
