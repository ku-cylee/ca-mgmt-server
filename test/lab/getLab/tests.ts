/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { Lab } from '../../../src/models';
import {
    deletedOpenLab,
    deletedUnopenLab,
    studentUser,
    taUser,
    undeletedOpenLab,
    undeletedUnopenLab,
} from './mock';
import { admin, Test } from '../../commons';
import { dataSource } from '../database';
import { request } from './request';

const getLabByName = async (name: string) => {
    const repo = dataSource.getRepository(Lab);
    const lab = await repo.findOneBy({ name });
    if (!lab) throw new Error();
    return lab;
};

const compareLabs = (actual: any, expected: any) => {
    expect(actual).to.be.an('object');
    expect(actual).to.have.all.keys(
        'id',
        'name',
        'openAt',
        'dueDate',
        'closeAt',
        'author',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'skeletonFiles',
        'submissionFiles',
    );
    expect(actual.id).to.be.a('number');
    expect(actual.name).to.be.a('string');
    expect(actual.openAt).to.be.a('number');
    expect(actual.dueDate).to.be.a('number');
    expect(actual.closeAt).to.be.a('number');
    expect(actual.author).to.be.an('object');
    expect(actual.createdAt).to.be.a('number');
    expect(actual.updatedAt).to.be.a('number');
    expect(actual.deletedAt).to.be.a('number');
    expect(actual.skeletonFiles).to.be.a('array');
    expect(actual.submissionFiles).to.be.an('array');

    expect(actual.name).to.equal(expected.name);
    expect(actual.openAt).to.equal(expected.openAt);
    expect(actual.dueDate).to.equal(expected.dueDate);
    expect(actual.closeAt).to.equal(expected.closeAt);
    expect(actual.author).to.have.key('username');
    expect(actual.author.username).to.equal(expected.authorUsername);
    expect(actual.deletedAt).to.equal(expected.deletedAt);

    expect(actual.skeletonFiles).to.have.lengthOf(expected.skeletonFileData.length);
    actual.skeletonFiles.forEach((a: any, i: number) => {
        expect(a).to.have.all.keys('id', 'path', 'createdAt');
        expect(a.id).to.be.a('number');
        expect(a.path).to.be.a('string');
        expect(a.createdAt).to.be.a('number');
        expect(a.path).to.equal(expected.skeletonFileData[i].path);
    });

    expect(actual.submissionFiles).to.have.lengthOf(expected.submissionFilenames.length);
    actual.submissionFiles.forEach((a: any, i: number) => {
        expect(a).to.have.all.keys('id', 'name', 'createdAt');
        expect(a.id).to.be.a('number');
        expect(a.name).to.be.a('string');
        expect(a.createdAt).to.be.a('number');
        expect(a.name).to.equal(expected.submissionFilenames[i]);
    });
};

export const tests: Test[] = [
    {
        name: 'should respond lab data if lab is undeleted and open, requester is admin',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabUdO',
                },
                requester: admin,
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedOpenLab);
        },
    },
    {
        name: 'should respond lab data if lab is undeleted and unopen, requester is admin',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabUdUo',
                },
                requester: admin,
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedUnopenLab);
        },
    },
    {
        name: 'should respond lab data if lab is deleted and open, requester is admin',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabDO',
                },
                requester: admin,
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, deletedOpenLab);
        },
    },
    {
        name: 'should respond lab data if lab is deleted and unopen, requester is admin',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabDUo',
                },
                requester: admin,
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, deletedUnopenLab);
        },
    },

    {
        name: 'should respond lab data if lab is undeleted and open, requester is ta',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabUdO',
                },
                requester: taUser,
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedOpenLab);
        },
    },
    {
        name: 'should respond lab data if lab is undeleted and unopen, requester is ta',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabUdUo',
                },
                requester: taUser,
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedUnopenLab);
        },
    },
    {
        name: 'should throw 404 if lab is deleted and open, requester is ta',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabDO',
                },
                requester: taUser,
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if lab is deleted and unopen, requester is ta',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabDUo',
                },
                requester: taUser,
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },

    {
        name: 'should respond lab data if lab is undeleted and open, requester is student',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabUdO',
                },
                requester: studentUser,
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedOpenLab);
        },
    },
    {
        name: 'should throw 403 if lab is undeleted and unopen, requester is student',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabUdUo',
                },
                requester: studentUser,
            });

            expect(res.status).equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if lab is deleted and open, requester is student',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabDO',
                },
                requester: studentUser,
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if lab is deleted and unopen, requester is student',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabDUo',
                },
                requester: studentUser,
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },

    {
        name: 'should throw 404 if the lab does not exist, requester is admin',
        func: async () => {
            const res = await request({
                params: {
                    labName: 'GlLabNotExist',
                },
                requester: admin,
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },
];
