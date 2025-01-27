import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import { Lab, SkeletonFile, User } from '../../../src/models';
import { getChecksum } from '../../../src/lib/checksum';

export const taUser = {
    username: 'DlSkelTa',
    secretKey: 'DlSkelTaSecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'DlSkelStudent',
    secretKey: 'DlSkelStudentSecretKey',
    role: UserRole.STUDENT,
};

export const otherTaUser = {
    username: 'DlSkelOtherTa',
    secretKey: 'DlSkelOtherTaSecretKey',
    role: UserRole.TA,
};

const labMocks = [
    {
        name: 'DlSkelUndAdmin',
        isDeleted: false,
    },
    {
        name: 'DlSkelUndTa',
        isDeleted: false,
    },
    {
        name: 'DlSkelUndOther',
        isDeleted: false,
    },
    {
        name: 'DlSkelDelAdmin',
        isDeleted: true,
    },
    {
        name: 'DlSkelDelTa',
        isDeleted: true,
    },
    {
        name: 'DlSkelDelOther',
        isDeleted: true,
    },
    {
        name: 'DlSkelUndStdnt',
        isDeleted: false,
    },
];

export const skeletonMocks = [
    {
        path: '/src/dlskel_undeleted_admin.v',
        content: 'DlSkelUndAdmin.v Content',
        isExecutable: false,
        labName: 'DlSkelUndAdmin',
        isDeleted: false,
    },
    {
        path: '/src/dlskel_undeleted_admin_deleted.v',
        content: 'DlSkelUndAdmin.v Deleted Content',
        isExecutable: false,
        labName: 'DlSkelUndAdmin',
        isDeleted: true,
    },
    {
        path: '/src/dlskel_undeleted_ta.v',
        content: 'DlSkelUndTa.v Content',
        isExecutable: false,
        labName: 'DlSkelUndTa',
        isDeleted: false,
    },
    {
        path: '/src/dlskel_undeleted_ta_deleted.v',
        content: 'DlSkelUndTa.v Deleted Content',
        isExecutable: false,
        labName: 'DlSkelUndTa',
        isDeleted: true,
    },
    {
        path: '/src/dlskel_undeleted_other.v',
        content: 'DlSkelUndOther.v Content',
        isExecutable: false,
        labName: 'DlSkelUndOther',
        isDeleted: false,
    },
    {
        path: '/src/dlskel_undeleted_other_deleted.v',
        content: 'DlSkelUndOther.v Deleted Content',
        isExecutable: false,
        labName: 'DlSkelUndOther',
        isDeleted: true,
    },
    {
        path: '/src/dlskel_deleted_admin.v',
        content: 'DlSkelDelAdmin.v Content',
        isExecutable: false,
        labName: 'DlSkelDelAdmin',
        isDeleted: false,
    },
    {
        path: '/src/dlskel_deleted_admin_deleted.v',
        content: 'DlSkelDelAdmin.v Deleted Content',
        isExecutable: false,
        labName: 'DlSkelDelAdmin',
        isDeleted: true,
    },
    {
        path: '/src/dlskel_deleted_ta.v',
        content: 'DlSkelDelTa.v Content',
        isExecutable: false,
        labName: 'DlSkelDelTa',
        isDeleted: false,
    },
    {
        path: '/src/dlskel_deleted_ta_deleted.v',
        content: 'DlSkelDelTa.v Deleted Content',
        isExecutable: false,
        labName: 'DlSkelDelTa',
        isDeleted: true,
    },
    {
        path: '/src/dlskel_deleted_other.v',
        content: 'DlSkelDelOther.v Content',
        isExecutable: false,
        labName: 'DlSkelDelOther',
        isDeleted: false,
    },
    {
        path: '/src/dlskel_deleted_other_deleted.v',
        content: 'DlSkelDelOther.v Deleted Content',
        isExecutable: false,
        labName: 'DlSkelDelOther',
        isDeleted: true,
    },
    {
        path: '/src/dlskel_undeleted_stdnt.v',
        content: 'DlSkelUndStdnt.v Content',
        isExecutable: false,
        labName: 'DlSkelUndStdnt',
        isDeleted: false,
    },
    {
        path: '/src/dlskel_undeleted_stdnt_deleted.v',
        content: 'DlSkelUndStdnt.v Deleted Content',
        isExecutable: false,
        labName: 'DlSkelUndStdnt',
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
    const author = users.find(user => user.username === 'DlSkelTa');
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
    const repo = dataSource.getRepository(SkeletonFile);
    const skeletons = repo.create(
        skeletonMocks.map(skeleton => {
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
