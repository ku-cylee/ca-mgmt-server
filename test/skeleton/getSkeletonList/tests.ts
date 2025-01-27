/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { Test } from '../../commons';
import { getCookie } from '../../commons/cookie';
import { admin } from '../admin';
import { getChecksum } from '../../../src/lib/checksum';
import {
    deletedLabSkeletonMocks,
    openLabSkeletonMocks,
    studentUser,
    taUser,
    unopenLabSkeletonMocks,
} from './mock';

const ADMIN_COOKIE = getCookie(admin);

const compare = (actual: any, expected: any) => {
    expect(actual.id).to.be.a('number');
    expect(actual.path).to.be.a('string');
    expect(actual.content).to.be.a('string');
    expect(actual.checksum).to.be.a('string');
    expect(actual.isExecutable).to.be.a('boolean');
    expect(actual.createdAt).to.be.a('number');
    expect(actual.deletedAt).to.be.a('number');

    expect(actual.path).to.equal(expected.path);
    expect(actual.content).to.equal(expected.content);
    expect(actual.checksum).to.equal(getChecksum(expected.content));
    expect(actual.isExecutable).to.equal(expected.isExecutable);
    if (expected.isDeleted) expect(actual.deletedAt).to.not.equal(0);
    else expect(actual.deletedAt).to.equal(0);
};

export const tests: Test[] = [
    {
        name: 'should respond skeleton file list if requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    labName: 'GlSkOpen',
                },
            });

            const expected = openLabSkeletonMocks;

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);

            res.data.forEach((actual: any, idx: number) => compare(actual, expected[idx]));
        },
    },
    {
        name: 'should respond skeleton file list if requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName: 'GlSkOpen',
                },
            });

            const expected = openLabSkeletonMocks.filter(sk => !sk.isDeleted);

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);

            res.data.forEach((actual: any, idx: number) => compare(actual, expected[idx]));
        },
    },
    {
        name: 'should respond skeleton file list if requester is student',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(studentUser),
                },
                params: {
                    labName: 'GlSkOpen',
                },
            });

            const expected = openLabSkeletonMocks.filter(sk => !sk.isDeleted);

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);

            res.data.forEach((actual: any, idx: number) => compare(actual, expected[idx]));
        },
    },
    {
        name: 'should respond skeleton file list if the lab is unopen, undeleted and requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    labName: 'GlSkUnopen',
                },
            });

            const expected = unopenLabSkeletonMocks;

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);

            res.data.forEach((actual: any, idx: number) => compare(actual, expected[idx]));
        },
    },
    {
        name: 'should respond skeleton file list if the lab is unopen, undeleted and requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName: 'GlSkUnopen',
                },
            });

            const expected = unopenLabSkeletonMocks.filter(sk => !sk.isDeleted);

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);

            res.data.forEach((actual: any, idx: number) => compare(actual, expected[idx]));
        },
    },
    {
        name: 'should throw 403 if the lab is unopen, undeleted and requester is student',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(studentUser),
                },
                params: {
                    labName: 'GlSkUnopen',
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond an empty list if the lab does not have any skeleton files and requester is not admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName: 'GlSkEmpty',
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if the lab does not exist',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    labName: 'GlSkNotExist',
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond skeleton file list if the lab is deleted and requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
                params: {
                    labName: 'GlSkDeleted',
                },
            });

            const expected = deletedLabSkeletonMocks;

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);

            res.data.forEach((actual: any, idx: number) => compare(actual, expected[idx]));
        },
    },
    {
        name: 'should throw 404 if the lab is deleted and requester is not admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName: 'GlSkDeleted',
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
];
