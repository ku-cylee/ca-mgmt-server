/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { DataSource } from 'typeorm';
import User from '../../../src/models/user';
import { Test } from '../../commons';
import { UserRole } from '../../../src/lib/enums';
import { studentUser, taUser } from './mock';

const { ADMIN_USERNAME, ADMIN_SECRETKEY } = process.env;

const ADMIN_COOKIE = `username=${ADMIN_USERNAME};secretKey=${ADMIN_SECRETKEY}`;

const createUser = async (
    dataSource: DataSource,
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

const getUsersById = async (
    dataSource: DataSource,
    id: number,
): Promise<User[]> => {
    const repo = dataSource.getRepository(User);
    const users = await repo.findBy({ id });
    return users;
};

export const tests: Test[] = [
    {
        name: 'should respond 200 if requester is admin and the user exists',
        func: async (dataSource: DataSource) => {
            const user = await createUser(
                dataSource,
                'DelUsr1',
                'DelUsr1SecretKey',
                UserRole.TA,
            );

            const res = await axios({
                method: 'delete',
                url: `/${user.id}`,
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const delUser = await getUsersById(dataSource, user.id);
            expect(delUser[0]).to.be.an('object');
            expect(delUser[0].isDeleted).to.be.true;
        },
    },
    {
        name: 'should respond 404 if requester is admin and the user does not exist',
        func: async (dataSource: DataSource) => {
            const user = await createUser(
                dataSource,
                'DelUsr2',
                'DelUsr2SecretKey',
                UserRole.TA,
            );
            await dataSource.getRepository(User).delete({ id: user.id });

            const res = await axios({
                method: 'delete',
                url: `/${user.id}`,
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 404 if requester is admin and the user is already deleted',
        func: async (dataSource: DataSource) => {
            const user = await createUser(
                dataSource,
                'DelUsr3',
                'DelUsr3SecretKey',
                UserRole.TA,
                true,
            );

            const res = await axios({
                method: 'delete',
                url: `/${user.id}`,
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const delUser = await getUsersById(dataSource, user.id);
            expect(delUser[0]).to.be.an('object');
            expect(delUser[0].isDeleted).to.be.true;
        },
    },
    {
        name: 'should respond 403 if requester is admin and the user is admin',
        func: async (dataSource: DataSource) => {
            const admin = await dataSource
                .getRepository(User)
                .findOneBy({ username: ADMIN_USERNAME });

            if (!admin) throw new Error();

            const res = await axios({
                method: 'delete',
                url: `/${admin.id}`,
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const delUser = await getUsersById(dataSource, admin.id);
            expect(delUser[0]).to.be('object');
            expect(delUser[0].isDeleted).to.be.false;
        },
    },
    {
        name: 'should respond 403 if requester is ta',
        func: async () => {
            const res = await axios({
                method: 'delete',
                url: `/1`,
                headers: {
                    Cookie: `username=${taUser.username};secretKey=${taUser.secretKey}`,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 403 if requester is student',
        func: async () => {
            const res = await axios({
                method: 'delete',
                url: `/1`,
                headers: {
                    Cookie: `username=${studentUser.username};secretKey=${studentUser.secretKey}`,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
];
