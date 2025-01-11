import { ClassConstructor, plainToInstance } from 'class-transformer';

export const toResponse = <T, V>(
    cls: ClassConstructor<T>,
    plain: V | V[],
): T | T[] => plainToInstance(cls, plain, { excludeExtraneousValues: true });
