import { FindOptionsWhere } from 'typeorm';
import { dataSource } from '../lib/database';
import { Bomb, Lab, User } from '../models';

const getRepo = () => dataSource.getRepository(Bomb);

export const getById = async (
    id: string,
    includeDeleted = false,
): Promise<Bomb | null> => {
    const repo = getRepo();

    const where: FindOptionsWhere<Bomb> = { id };
    if (!includeDeleted) where.lab = { deletedAt: 0 };

    const bomb = await repo.findOne({
        where,
        relations: {
            author: true,
            lab: true,
        },
    });

    return bomb;
};

export const getByLongId = async (
    longId: string,
    includeDeleted = false,
): Promise<Bomb | null> => {
    const repo = getRepo();

    const where: FindOptionsWhere<Bomb> = { longId };
    if (!includeDeleted) where.lab = { deletedAt: 0 };

    const bomb = await repo.findOne({
        where,
        relations: {
            author: true,
            lab: true,
        },
    });

    return bomb;
};

export const getListByLabAndAuthor = async (
    author: User | null,
    lab: Lab | null,
): Promise<Bomb[]> => {
    const repo = getRepo();

    const where: FindOptionsWhere<Bomb> = {};
    if (author) where.author = { id: author.id };
    if (lab) where.lab = { id: lab.id };

    const bombs = await repo.find({
        where,
        relations: {
            author: true,
            defuseTrials: true,
        },
        order: {
            defuseTrials: {
                id: 'ASC',
            },
        },
    });

    return bombs;
};

export const create = async (
    longId: string,
    lab: Lab,
    author: User,
    solutions: string[],
): Promise<Bomb> => {
    const repo = getRepo();
    const bomb = repo.create({
        id: longId.slice(0, 4),
        longId,
        lab,
        author,
        solutions,
        createdAt: Date.now(),
    });
    await repo.save(bomb);
    return bomb;
};
