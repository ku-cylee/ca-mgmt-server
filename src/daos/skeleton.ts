import { FindOptionsWhere } from 'typeorm';
import { getChecksum } from '../lib/checksum';
import { dataSource } from '../lib/database';
import { Lab, SkeletonFile } from '../models';

const getRepo = () => dataSource.getRepository(SkeletonFile);

export const getListByLab = async (
    labId: number,
    includeDeleted = false,
): Promise<SkeletonFile[]> => {
    const repo = getRepo();

    const where: FindOptionsWhere<SkeletonFile> = {
        lab: { id: labId },
    };
    if (!includeDeleted) where.deletedAt = 0;

    const skeletonFiles = await repo.find({
        where,
        order: { id: 'ASC' },
    });

    return skeletonFiles;
};

export const create = async (
    lab: Lab,
    path: string,
    content: string,
    isExecutable: boolean,
): Promise<SkeletonFile> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const skeletonFile = repo.create({
        lab,
        path,
        content,
        checksum: getChecksum(content),
        isExecutable,
        createdAt: currentTimestamp,
    });
    await repo.save(skeletonFile);

    return skeletonFile;
};

export const deleteListByLab = async (labId: number): Promise<number> => {
    const repo = getRepo();

    const result = await repo.delete({
        lab: {
            id: labId,
        },
    });

    return result.affected ?? 0;
};
