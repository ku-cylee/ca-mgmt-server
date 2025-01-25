import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import { Lab, SkeletonFile, SubmissionFile, User } from '../../../src/models';

export const taUser = {
    username: 'GlTa',
    secretKey: 'GlTaSecretKey',
    role: UserRole.TA,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const studentUser = {
    username: 'GlStdnt',
    secretKey: 'GlStdntSecretKey',
    role: UserRole.STUDENT,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const undeletedOpenLab = {
    name: 'GlLabUdO',
    openAt: Date.now() - 1000 * 3600,
    dueDate: Date.now() + 1000 * 3600,
    closeAt: Date.now() + 1000 * 3600 * 2,
    submissionFilenames: ['gl_lab_udo1.v', 'gl_lab_udo2.v'],
    authorUsername: 'GlTa',
    deletedAt: 0,
    skeletonFileData: [
        {
            path: '/src/gl_skel_udo1.v',
            content: 'gl_skel_udo1_content',
            checksum: 'checksum',
            isExecutable: false,
        },
        {
            path: '/src/gl_skel_udo2.v',
            content: 'gl_skel_udo2_content',
            checksum: 'checksum',
            isExecutable: true,
        },
    ],
};

export const undeletedUnopenLab = {
    name: 'GlLabUdUo',
    openAt: Date.now() + 1000 * 3600,
    dueDate: Date.now() + 1000 * 3600,
    closeAt: Date.now() + 1000 * 3600 * 2,
    submissionFilenames: ['gl_lab_uduo1.v', 'gl_lab_uduo2.v'],
    authorUsername: 'GlTa',
    deletedAt: 0,
    skeletonFileData: [
        {
            path: '/src/gl_skel_uduo1.v',
            content: 'gl_skel_uduo1_content',
            checksum: 'checksum',
            isExecutable: false,
        },
        {
            path: '/src/gl_skel_uduo2.v',
            content: 'gl_skel_uduo2_content',
            checksum: 'checksum',
            isExecutable: true,
        },
    ],
};

export const deletedOpenLab = {
    name: 'GlLabDO',
    openAt: Date.now() - 1000 * 3600,
    dueDate: Date.now() + 1000 * 3600,
    closeAt: Date.now() + 1000 * 3600 * 2,
    submissionFilenames: ['gl_lab_do1.v', 'gl_lab_do2.v'],
    authorUsername: 'GlTa',
    deletedAt: Date.now(),
    skeletonFileData: [
        {
            path: '/src/gl_skel_do1.v',
            content: 'gl_skel_do1_content',
            checksum: 'checksum',
            isExecutable: false,
        },
        {
            path: '/src/gl_skel_do2.v',
            content: 'gl_skel_do2_content',
            checksum: 'checksum',
            isExecutable: true,
        },
    ],
};

export const deletedUnopenLab = {
    name: 'GlLabDUo',
    openAt: Date.now() + 1000 * 3600,
    dueDate: Date.now() + 1000 * 3600,
    closeAt: Date.now() + 1000 * 3600 * 2,
    submissionFilenames: ['gl_lab_duo1.v', 'gl_lab_duo2.v'],
    authorUsername: 'GlTa',
    deletedAt: Date.now(),
    skeletonFileData: [
        {
            path: '/src/gl_skel_duo1.v',
            content: 'gl_skel_duo1_content',
            checksum: 'checksum',
            isExecutable: false,
        },
        {
            path: '/src/gl_skel_duo2.v',
            content: 'gl_skel_duo2_content',
            checksum: 'checksum',
            isExecutable: true,
        },
    ],
};

export const createMock = async (dataSource: DataSource) => {
    const userRepo = dataSource.getRepository(User);
    const users = userRepo.create([taUser, studentUser]);
    await userRepo.save(users);

    const labMocks = [
        undeletedOpenLab,
        undeletedUnopenLab,
        deletedUnopenLab,
        deletedOpenLab,
    ];

    const labRepo = dataSource.getRepository(Lab);
    const labs = labRepo.create(
        labMocks.map(lab => {
            const author = users.find(
                user => user.username === lab.authorUsername,
            );
            return {
                ...lab,
                author,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        }),
    );
    await labRepo.save(labs);

    const skeletonRepo = dataSource.getRepository(SkeletonFile);
    const skeletons = skeletonRepo.create(
        labMocks
            .map((labMock, labIdx) =>
                labMock.skeletonFileData.map(skeleton => {
                    return {
                        ...skeleton,
                        lab: labs[labIdx],
                        createdAt: Date.now(),
                    };
                }),
            )
            .reduce((prev, next) => prev.concat(next), []),
    );
    await skeletonRepo.save(skeletons);

    const sbfRepo = dataSource.getRepository(SubmissionFile);
    const submissionFiles = sbfRepo.create(
        labMocks
            .map((labMock, labIdx) =>
                labMock.submissionFilenames.map((name: string) => {
                    return {
                        name,
                        lab: labs[labIdx],
                        createdAt: Date.now(),
                    };
                }),
            )
            .reduce((prev, next) => prev.concat(next), []),
    );
    await sbfRepo.save(submissionFiles);
};
