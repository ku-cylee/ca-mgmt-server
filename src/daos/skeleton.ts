import { getChecksum } from '../lib/checksum';
import { dataSource } from '../lib/database';
import Lab from '../models/lab';
import SkeletonFile from '../models/skeleton-file';

const getRepo = () => dataSource.getRepository(SkeletonFile);

export const getListByLab = async (labId: number): Promise<SkeletonFile[]> => {
    const repo = getRepo();

    const skeletonFiles = await repo.find({
        where: {
            lab: {
                id: labId,
            },
        },
        relations: {
            lab: true,
        },
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
