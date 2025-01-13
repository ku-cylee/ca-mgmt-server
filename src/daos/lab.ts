import { FindOptionsWhere, LessThanOrEqual } from 'typeorm';
import { dataSource } from '../lib/database';
import Lab from '../models/lab';
import User from '../models/user';

const getRepo = () => dataSource.getRepository(Lab);

export const getByName = async (
    name: string,
    includeUnopen = false,
    includeDeleted = false,
): Promise<Lab | null> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const options: FindOptionsWhere<Lab> = { name };
    if (!includeUnopen) options.openAt = LessThanOrEqual(currentTimestamp);
    if (!includeDeleted) options.deletedAt = 0;

    const lab = await repo.findOne({
        where: options,
        relations: { author: true, skeletonFiles: true },
    });

    return lab;
};

export const getList = async (
    includeUnopen = false,
    includeDeleted = false,
): Promise<Lab[]> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const options: FindOptionsWhere<Lab> = {};
    if (!includeUnopen) options.openAt = LessThanOrEqual(currentTimestamp);
    if (!includeDeleted) options.deletedAt = 0;

    const labs = await repo.find({
        where: options,
        relations: { author: true },
    });

    return labs;
};

export const create = async (
    name: string,
    openAt: number,
    dueDate: number,
    closeAt: number,
    author: User,
): Promise<Lab> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const lab = repo.create({
        name,
        openAt,
        dueDate,
        closeAt,
        submissionFiles: [],
        author,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp,
    });
    await repo.save(lab);

    return lab;
};

export const updateByName = async (
    lab: Lab,
    name: string,
    openAt: number,
    dueDate: number,
    closeAt: number,
): Promise<void> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    lab.name = name;
    lab.openAt = openAt;
    lab.dueDate = dueDate;
    lab.closeAt = closeAt;
    lab.updatedAt = currentTimestamp;

    await repo.save(lab);
};

export const updateSubmissionFilesByName = async (
    lab: Lab,
    submissionFiles: string[],
): Promise<void> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    lab.submissionFiles = submissionFiles;
    lab.updatedAt = currentTimestamp;

    await repo.save(lab);
};

export const deleteByName = async (lab: Lab): Promise<void> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    lab.deletedAt = currentTimestamp;

    await repo.save(lab);
};
