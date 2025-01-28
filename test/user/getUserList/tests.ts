/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { deletedStudents, deletedTAs, undeletedStudents, undeletedTAs } from './mock';
import { getCookie } from '../../commons/cookie';
import { admin } from '../admin';
import { Test } from '../../commons/tests';

const ADMIN_COOKIE = getCookie(admin);
const TA_COOKIE = getCookie(undeletedTAs[0]);
const STDNT_COOKIE = getCookie(undeletedStudents[0]);

const compareUsers = (actual: any, expected: any) => {
    expect(actual).to.be.an('object');
    expect(actual).to.have.all.keys(
        'id',
        'username',
        'role',
        'createdAt',
        'updatedAt',
        'deletedAt',
    );
    expect(actual.id).to.be.a('number');
    expect(actual.username).to.be.a('string');
    expect(actual.role).to.be.a('string');
    expect(actual.createdAt).to.be.a('number');
    expect(actual.updatedAt).to.be.a('number');
    expect(actual.deletedAt).to.be.a('number');

    expect(actual.username).to.equal(expected.username);
    expect(actual.role).to.equal(expected.role);
};

export const tests: Test[] = [
    {
        name: 'should respond all users if ta=true, student=true, deleted=true, requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: true,
                    student: true,
                    deleted: true,
                },
            });

            const expected = [
                ...undeletedTAs,
                ...deletedTAs,
                ...undeletedStudents,
                ...deletedStudents,
            ];

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);
            res.data.forEach((user: any, idx: number) => compareUsers(user, expected[idx]));
        },
    },
    {
        name: 'should respond all ta users if ta=true, student=false, deleted=true, requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: true,
                    student: false,
                    deleted: true,
                },
            });

            const expected = [...undeletedTAs, ...deletedTAs];

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);
            res.data.forEach((user: any, idx: number) => compareUsers(user, expected[idx]));
        },
    },
    {
        name: 'should respond all student users if ta=false, student=true, deleted=true, requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: false,
                    student: true,
                    deleted: true,
                },
            });

            const expected = [...undeletedStudents, ...deletedStudents];

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);
            res.data.forEach((user: any, idx: number) => compareUsers(user, expected[idx]));
        },
    },
    {
        name: 'should respond no users if ta=false, student=false, deleted=true, requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: false,
                    student: false,
                    deleted: true,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond undeleted users if ta=true, student=true, deleted=false, requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: true,
                    student: true,
                    deleted: false,
                },
            });

            const expected = [...undeletedTAs, ...undeletedStudents];

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);
            res.data.forEach((user: any, idx: number) => compareUsers(user, expected[idx]));
        },
    },
    {
        name: 'should respond undeleted ta users if ta=true, student=false, deleted=false, requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: true,
                    student: false,
                    deleted: false,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(undeletedTAs.length);
            res.data.forEach((user: any, idx: number) => compareUsers(user, undeletedTAs[idx]));
        },
    },
    {
        name: 'should respond undeleted student users if ta=false, student=true, deleted=false, requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: false,
                    student: true,
                    deleted: false,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(2);
            res.data.forEach((user: any, idx: number) =>
                compareUsers(user, undeletedStudents[idx]),
            );
        },
    },
    {
        name: 'should respond no users if ta=false, student=false, deleted=false, requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: false,
                    student: false,
                    deleted: false,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if query.ta does not exist and requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    student: true,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if query.ta is invalid and requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: 'ta',
                    student: true,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if query.student does not exist and requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: true,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if query.student is invalid and requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    ta: true,
                    student: 'student',
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 403 if requester is ta and deleted=true',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: TA_COOKIE,
                },
                params: {
                    ta: true,
                    student: true,
                    deleted: true,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond undeleted users if ta=true, student=true, deleted=false, requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: TA_COOKIE,
                },
                params: {
                    ta: true,
                    student: true,
                    deleted: false,
                },
            });

            const expected = [...undeletedTAs, ...undeletedStudents];

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);
            res.data.forEach((user: any, idx: number) => compareUsers(user, expected[idx]));
        },
    },
    {
        name: 'should respond undeleted ta users if ta=true, student=false, deleted=false, requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: TA_COOKIE,
                },
                params: {
                    ta: true,
                    student: false,
                    deleted: false,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(undeletedTAs.length);
            res.data.forEach((user: any, idx: number) => compareUsers(user, undeletedTAs[idx]));
        },
    },
    {
        name: 'should respond undeleted student users if ta=false, student=true, deleted=false, requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: TA_COOKIE,
                },
                params: {
                    ta: false,
                    student: true,
                    deleted: false,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(2);
            res.data.forEach((user: any, idx: number) =>
                compareUsers(user, undeletedStudents[idx]),
            );
        },
    },
    {
        name: 'should respond no users if ta=false, student=false, deleted=false, requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: TA_COOKIE,
                },
                params: {
                    ta: false,
                    student: false,
                    deleted: false,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if query.ta does not exist and requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: TA_COOKIE,
                },
                params: {
                    student: true,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if query.ta is invalid and requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: TA_COOKIE,
                },
                params: {
                    ta: 'ta',
                    student: true,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if query.student does not exist and requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: TA_COOKIE,
                },
                params: {
                    ta: true,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if query.student is invalid and requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: TA_COOKIE,
                },
                params: {
                    ta: true,
                    student: 'student',
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 403 requester is student, regardless of input',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/user',
                headers: {
                    Cookie: STDNT_COOKIE,
                },
                params: {
                    ta: true,
                    student: true,
                    deleted: true,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
];
