/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { admin, Test } from '../../commons';
import { getChecksum } from '../../../src/lib/checksum';
import {
    deletedLabSkeletonMocks,
    openLabSkeletonMocks,
    studentUser,
    taUser,
    unopenLabSkeletonMocks,
} from './mock';
import { request } from './request';

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
            const labName = 'GlSkOpen';
            const res = await request({
                requester: admin,
                query: {
                    labName,
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
            const labName = 'GlSkOpen';
            const res = await request({
                requester: taUser,
                query: {
                    labName,
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
            const labName = 'GlSkOpen';
            const res = await request({
                requester: studentUser,
                query: {
                    labName,
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
            const labName = 'GlSkUnopen';
            const res = await request({
                requester: admin,
                query: {
                    labName,
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
            const labName = 'GlSkUnopen';
            const res = await request({
                requester: taUser,
                query: {
                    labName,
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
            const labName = 'GlSkUnopen';
            const res = await request({
                requester: studentUser,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond an empty list if the lab does not have any skeleton files and requester is not admin',
        func: async () => {
            const labName = 'GlSkEmpty';
            const res = await request({
                requester: taUser,
                query: {
                    labName,
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
            const labName = 'GlSkNotExist';
            const res = await request({
                requester: admin,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond skeleton file list if the lab is deleted and requester is admin',
        func: async () => {
            const labName = 'GlSkDeleted';
            const res = await request({
                requester: admin,
                query: {
                    labName,
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
            const labName = 'GlSkDeleted';
            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
];
