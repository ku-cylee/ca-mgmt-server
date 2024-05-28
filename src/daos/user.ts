import { dataSource } from '../lib/database';
import User from '../models/user';

export const getByUsernameAndSecretKey = async (
    username: string,
    secretKey: string,
): Promise<User | null> => {
    const userRepo = dataSource.getRepository(User);
    const user = userRepo.findOne({
        where: { username, secretKey },
    });
    return user;
};
