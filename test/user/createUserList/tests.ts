/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { DataSource, In } from 'typeorm';
import { Test } from '../../commons';
import { duplicateUser, studentUser, taUser } from './mock';
import { UserRole } from '../../../src/lib/enums';
import { User } from '../../../src/models';

const { ADMIN_USERNAME, ADMIN_SECRETKEY } = process.env;

const ADMIN_COOKIE = `username=${ADMIN_USERNAME};secretKey=${ADMIN_SECRETKEY}`;

const getUsersByUsername = async (dataSource: DataSource, usernames: string[]): Promise<User[]> => {
    const repo = dataSource.getRepository(User);
    const users = await repo.findBy({
        username: In(usernames),
    });
    return users;
};

export const tests: Test[] = [
    {
        name: 'should respond 200 if requester is admin and role is TA',
        func: async (dataSource: DataSource) => {
            const rawData = [
                {
                    username: 'CrUsrExTa0',
                    secretKey: 'CrUsrExTa0SecretKey',
                },
                {
                    username: 'CrUsrExTa1',
                    secretKey: ' CrUsrExTa1SecretKey  ',
                },
                {
                    username: '  CrUsrEx-Ta2      ',
                    secretKey: 'CrUsrExTa2SecretKey',
                },
            ];

            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    role: UserRole.TA,
                    usersData: rawData,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const users = await getUsersByUsername(dataSource, [
                'CrUsrExTa0',
                'CrUsrExTa1',
                'CrUsrEx-Ta2',
            ]);

            expect(users).to.have.lengthOf(3);
            Array(3).forEach((idx: number) => {
                expect(users[idx].username).to.equal(rawData[idx].username.trim());
                expect(users[idx].secretKey).to.equal(rawData[idx].secretKey.trim());
                expect(users[idx].role).to.equal(UserRole.TA);
            });
        },
    },
    {
        name: 'should respond 200 if requester is admin and role is student',
        func: async (dataSource: DataSource) => {
            const rawData = [
                {
                    username: 'CrUsrExStdnt0',
                    secretKey: 'CrUsrExStdnt0SecretKey',
                },
                {
                    username: 'CrUsrExStdnt1',
                    secretKey: ' CrUsrExStdnt1SecretKey  ',
                },
                {
                    username: '  CrUsrExStdnt2    ',
                    secretKey: 'CrUsrExStdnt2SecretKey',
                },
            ];

            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    role: UserRole.TA,
                    usersData: rawData,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const repo = dataSource.getRepository(User);
            const users = await repo.findBy({
                username: In(['CrUsrExStdnt0', 'CrUsrExStdnt1', 'CrUsrExStdnt2']),
            });

            expect(users).to.have.lengthOf(3);
            Array(3).forEach((idx: number) => {
                expect(users[idx].username).to.equal(rawData[idx].username.trim());
                expect(users[idx].secretKey).to.equal(rawData[idx].secretKey.trim());
                expect(users[idx].role).to.equal(UserRole.TA);
            });
        },
    },
    {
        name: 'should throw 403 if requester is ta',
        func: async () => {
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: `username=${taUser.username};secretKey=${taUser.secretKey}`,
                },
                data: {
                    role: UserRole.STUDENT,
                    usersData: [],
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 403 if requester is student',
        func: async () => {
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: `username=${studentUser.username};secretKey=${studentUser.secretKey}`,
                },
                data: {
                    role: UserRole.STUDENT,
                    usersData: [],
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if role is not given',
        func: async () => {
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    usersData: [],
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if role is invalid',
        func: async () => {
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    role: UserRole.ADMIN,
                    usersData: [],
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if usersData is not given',
        func: async () => {
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    role: UserRole.STUDENT,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 some usernames of usersData is not given',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    role: UserRole.TA,
                    usersData: [
                        {
                            username: 'CrUsrUn11',
                            secretKey: 'CrUsrUn11SecretKey',
                        },
                        {
                            secretKey: 'CrUsrUn12SecretKey',
                        },
                        {
                            username: 'CrUsrUn13',
                            secretKey: 'CrUsrUn13SecretKey',
                        },
                    ],
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;

            const users = await getUsersByUsername(dataSource, ['CrUsrUn11', 'CrUsrUn13']);

            expect(users).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if some usernames not consist of alphanum or hyphen',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    role: UserRole.TA,
                    usersData: [
                        {
                            username: 'CrUsrUn21',
                            secretKey: 'CrUsrUn21SecretKey',
                        },
                        {
                            username: 'CrUsrUn22',
                            secretKey: 'CrUsrUn22SecretKey',
                        },
                        {
                            username: 'CrUsrUn23 ##',
                            secretKey: 'CrUsrUn23SecretKey',
                        },
                    ],
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;

            const users = await getUsersByUsername(dataSource, [
                'CrUsrUn21',
                'CrUsrUn22',
                'CrUsrUn23',
            ]);

            expect(users).to.be.empty;
        },
    },
    {
        name: 'should throw 400 some usernames of usersData is not given',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    role: UserRole.TA,
                    usersData: [
                        {
                            username: 'CrUsrUn31',
                            secretKey: 'CrUsrUn31SecretKey',
                        },
                        {
                            secretKey: 'CrUsrUn32SecretKey',
                        },
                        {
                            username: 'CrUsrUn33',
                            secretKey: 'CrUsrUn33SecretKey',
                        },
                    ],
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;

            const users = await getUsersByUsername(dataSource, [
                'CrUsrUn31',
                'CrUsrUn32',
                'CrUsrUn33',
            ]);

            expect(users).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if some secretKeys exceed maxlength of 64',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    role: UserRole.TA,
                    usersData: [
                        {
                            username: 'CrUsrSk11',
                            secretKey: 'CrUsrSk11SecretKey',
                        },
                        {
                            username: 'CrUsrSk12',
                            secretKey:
                                'CrUsrSk12SecretKeyCrUsrSk12SecretKeyCrUsrSk12SecretKeyCrUsrSk12SecretKey',
                        },
                        {
                            username: 'CrUsrSk13',
                            secretKey: 'CrUsrSk13SecretKey',
                        },
                    ],
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;

            const users = await getUsersByUsername(dataSource, [
                'CrUsrSk11',
                'CrUsrSk12',
                'CrUsrSk13',
            ]);

            expect(users).to.be.empty;
        },
    },
    {
        name: 'should throw 409 if some usernames already exist',
        func: async (dataSource: DataSource) => {
            const { username, secretKey } = duplicateUser;
            const res = await axios({
                method: 'post',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                data: {
                    role: UserRole.TA,
                    usersData: [
                        {
                            username: 'CrUsrDp1',
                            secretKey: 'CrUsrDp1SecretKey',
                        },
                        {
                            username,
                            secretKey: secretKey + secretKey,
                        },
                    ],
                },
            });

            expect(res.status).to.equal(409);
            expect(res.data).to.be.empty;

            const users = await getUsersByUsername(dataSource, ['CrUsrDp1', username]);

            expect(users).to.be.lengthOf(1);
            expect(users[0].secretKey).to.not.equal(secretKey + secretKey);
        },
    },
];
