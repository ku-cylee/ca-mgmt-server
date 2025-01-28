/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { UserRole } from '../../../src/lib/enums';
import { studentUser, taUser } from './mock';
import { User } from '../../../src/models';
import { admin, Test } from '../../commons';
import { dataSource } from '../database';
import { request } from './request';

const getUserByName = async (username: string): Promise<User | null> => {
    const repo = dataSource.getRepository(User);
    const user = await repo.findOneBy({ username });
    return user;
};

export const tests: Test[] = [
    {
        name: 'should respond 200 if requester is admin and the user exists',
        func: async () => {
            const username = 'DUserExist';
            const res = await request({
                requester: admin,
                params: {
                    username,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const user = await getUserByName(username);
            expect(user).to.be.not.null;
            expect(user?.isDeleted).to.be.true;
        },
    },
    {
        name: 'should respond 404 if requester is admin and the user does not exist',
        func: async () => {
            const username = 'DUserNotExist';
            const res = await request({
                requester: admin,
                params: {
                    username,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 404 if requester is admin and the user is already deleted',
        func: async () => {
            const username = 'DUserDeleted';
            const res = await request({
                requester: admin,
                params: {
                    username,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const user = await getUserByName(username);
            expect(user).to.be.not.null;
            expect(user?.isDeleted).to.be.true;
        },
    },
    {
        name: 'should respond 403 if requester is admin and the user is admin',
        func: async () => {
            const username = 'DUserAdmin';
            const res = await request({
                requester: admin,
                params: {
                    username,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const user = await getUserByName(username);
            expect(user).to.be.not.null;
            expect(user?.isDeleted).to.be.false;
        },
    },
    {
        name: 'should respond 403 if requester is ta',
        func: async () => {
            const username = 'DUserDelTa';
            const res = await request({
                requester: taUser,
                params: {
                    username,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const user = await getUserByName(username);
            expect(user).to.be.not.null;
            expect(user?.isDeleted).to.be.false;
        },
    },
    {
        name: 'should respond 403 if requester is student',
        func: async () => {
            const username = 'DUserDelStudent';
            const res = await request({
                requester: studentUser,
                params: {
                    username,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const user = await getUserByName(username);
            expect(user).to.be.not.null;
            expect(user?.isDeleted).to.be.false;
        },
    },
];
