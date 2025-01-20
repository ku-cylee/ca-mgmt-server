import { ValueTransformer } from 'typeorm';

export const transformer: ValueTransformer = {
    from: (entity: string) => parseInt(entity, 10),
    to: (db: number) => db,
};
