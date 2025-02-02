import { FindOptionsWhere } from 'typeorm';
import { dataSource } from '../lib/database';
import { Bomb, Defuse } from '../models';

const getRepo = () => dataSource.getRepository(Defuse);

export const getListByBomb = async (
    bomb: Bomb,
    includeDeleted = false,
): Promise<Defuse[]> => {
    const repo = getRepo();

    const bombWhere: FindOptionsWhere<Bomb> = { id: bomb.id };
    if (!includeDeleted) bombWhere.lab = { deletedAt: 0 };

    const defuses = await repo.find({
        where: {
            bomb: bombWhere,
        },
        relations: {
            bomb: {
                author: true,
            },
        },
    });
    return defuses;
};

export const create = async (
    bomb: Bomb,
    phase: number,
    answer: string,
    exploded: boolean,
): Promise<Defuse> => {
    const repo = getRepo();
    const defuse = repo.create({
        bomb,
        phase,
        answer,
        exploded,
    });
    await repo.save(defuse);
    return defuse;
};
