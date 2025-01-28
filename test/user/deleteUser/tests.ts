/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { UserRole } from '../../../src/lib/enums';
import { studentUser, taUser } from './mock';
import { User } from '../../../src/models';
import { admin, Test } from '../../commons';
import { dataSource } from '../database';
import { request } from './request';

const createUser = async (
    username: string,
    secretKey: string,
    role: UserRole,
    isDeleted = false,
): Promise<User> => {
    const repo = dataSource.getRepository(User);
    const user = repo.create({
        username,
        secretKey,
        role,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: isDeleted ? Date.now() : 0,
    });
    await repo.save(user);
    return user;
};

const getUsersById = async (id: number): Promise<User[]> => {
    const repo = dataSource.getRepository(User);
    const users = await repo.findBy({ id });
    return users;
};

export const tests: Test[] = [
    {
        name: 'should respond 200 if requester is admin and the user exists',
        func: async () => {
            const user = await createUser('DelUsr1', 'DelUsr1SecretKey', UserRole.TA);

            const res = await request({
                requester: admin,
                params: {
                    userId: user.id,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const delUser = await getUsersById(user.id);
            expect(delUser[0]).to.be.an('object');
            expect(delUser[0].isDeleted).to.be.true;
        },
    },
    {
        name: 'should respond 404 if requester is admin and the user does not exist',
        func: async () => {
            const user = await createUser('DelUsr2', 'DelUsr2SecretKey', UserRole.TA);
            await dataSource.getRepository(User).delete({ id: user.id });

            const res = await request({
                requester: admin,
                params: {
                    userId: user.id,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 404 if requester is admin and the user is already deleted',
        func: async () => {
            const user = await createUser('DelUsr3', 'DelUsr3SecretKey', UserRole.TA, true);

            const res = await request({
                requester: admin,
                params: {
                    userId: user.id,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const delUser = await getUsersById(user.id);
            expect(delUser[0]).to.be.an('object');
            expect(delUser[0].isDeleted).to.be.true;
        },
    },
    {
        name: 'should respond 403 if requester is admin and the user is admin',
        func: async () => {
            const user = await dataSource
                .getRepository(User)
                .findOneBy({ username: admin.username });
            if (!user) throw new Error();

            const res = await request({
                requester: admin,
                params: {
                    userId: user.id,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const delUser = await getUsersById(user.id);
            expect(delUser[0]).to.be.an('object');
            expect(delUser[0].isDeleted).to.be.false;
        },
    },
    {
        name: 'should respond 403 if requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    userId: 1,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 403 if requester is student',
        func: async () => {
            const res = await request({
                requester: studentUser,
                params: {
                    userId: 1,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
];
