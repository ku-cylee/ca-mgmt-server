import { FindOptionsWhere } from 'typeorm';
import { getChecksum } from '../lib/checksum';
import { dataSource } from '../lib/database';
import Lab from '../models/lab';
import Submission from '../models/submission';
import User from '../models/user';

const getRepo = () => dataSource.getRepository(Submission);

export const getListByLabAndAuthor = async (
    author: User | null,
    lab: Lab | null,
    includeContent: boolean,
): Promise<Submission[]> => {
    const repo = getRepo();

    const where: FindOptionsWhere<Submission> = {};
    if (author) where.author = { id: author.id };
    if (lab) where.lab = { id: lab.id };

    const submissions = await repo.find({
        select: {
            id: true,
            lab: {
                id: true,
            },
            author: {
                username: true,
            },
            filename: true,
            content: includeContent,
            checksum: includeContent,
            createdAt: true,
            updatedAt: true,
        },
        where,
        relations: {
            author: true,
            lab: true,
        },
    });

    return submissions;
};

export const create = async (
    lab: Lab,
    author: User,
    filename: string,
    content: string,
): Promise<Submission> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const submission = repo.create({
        lab,
        author,
        filename,
        content,
        checksum: getChecksum(content),
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp,
    });
    await repo.save(submission);

    return submission;
};
