/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { DataSource } from 'typeorm';
import { Test } from '../../commons';
import { Lab } from '../../../src/models';
import {
    deletedOpenLab,
    deletedUnopenLab,
    studentUser,
    taUser,
    undeletedOpenLab,
    undeletedUnopenLab,
} from './mock';

const { ADMIN_USERNAME, ADMIN_SECRETKEY } = process.env;

const ADMIN_COOKIE = `username=${ADMIN_USERNAME};secretKey=${ADMIN_SECRETKEY}`;
const TA_COOKIE = `username=${taUser.username};secretKey=${taUser.secretKey}`;
const STUDENT_COOKIE = `username=${studentUser.username};secretKey=${studentUser.secretKey}`;

const getLabByName = async (dataSource: DataSource, name: string) => {
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
        'submissionFiles',
        'author',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'skeletonFiles',
    );
    expect(actual.id).to.be.a('number');
    expect(actual.name).to.be.a('string');
    expect(actual.openAt).to.be.a('number');
    expect(actual.dueDate).to.be.a('number');
    expect(actual.closeAt).to.be.a('number');
    expect(actual.submissionFiles).to.be.an('array');
    expect(actual.author).to.be.an('object');
    expect(actual.createdAt).to.be.a('number');
    expect(actual.updatedAt).to.be.a('number');
    expect(actual.deletedAt).to.be.a('number');
    expect(actual.skeletonFiles).to.be.a('array');

    expect(actual.name).to.equal(expected.name);
    expect(actual.openAt).to.equal(expected.openAt);
    expect(actual.dueDate).to.equal(expected.dueDate);
    expect(actual.closeAt).to.equal(expected.closeAt);
    expect(actual.submissionFiles).to.deep.equal(expected.submissionFiles);
    expect(actual.author).to.have.key('username');
    expect(actual.author.username).to.equal(expected.authorUsername);
    expect(actual.deletedAt).to.equal(expected.deletedAt);

    expect(actual.skeletonFiles).to.have.lengthOf(expected.skeletonFiles.length);
    actual.skeletonFiles.forEach((skeleton: any, idx: number) => {
        expect(skeleton).to.have.all.keys('id', 'path', 'createdAt');
        expect(skeleton.id).to.be.a('number');
        expect(skeleton.path).to.be.a('string');
        expect(skeleton.createdAt).to.be.a('number');
        expect(skeleton.path).to.equal(expected.skeletonFiles[idx].path);
    });
};

export const tests: Test[] = [
    {
        name: 'should respond lab data if lab is undeleted and open, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabUdO');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedOpenLab);
        },
    },
    {
        name: 'should respond lab data if lab is undeleted and unopen, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabUdUo');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedUnopenLab);
        },
    },
    {
        name: 'should respond lab data if lab is deleted and open, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabDO');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, deletedOpenLab);
        },
    },
    {
        name: 'should respond lab data if lab is deleted and unopen, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabDUo');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, deletedUnopenLab);
        },
    },

    {
        name: 'should respond lab data if lab is undeleted and open, requester is ta',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabUdO');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: TA_COOKIE,
                },
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedOpenLab);
        },
    },
    {
        name: 'should respond lab data if lab is undeleted and unopen, requester is ta',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabUdUo');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: TA_COOKIE,
                },
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedUnopenLab);
        },
    },
    {
        name: 'should throw 404 if lab is deleted and open, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabDO');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: TA_COOKIE,
                },
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if lab is deleted and unopen, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabDUo');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: TA_COOKIE,
                },
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },

    {
        name: 'should respond lab data if lab is undeleted and open, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabUdO');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: STUDENT_COOKIE,
                },
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('object');
            compareLabs(res.data, undeletedOpenLab);
        },
    },
    {
        name: 'should throw 404 if lab is undeleted and unopen, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabUdUo');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: STUDENT_COOKIE,
                },
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if lab is deleted and open, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabDO');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: STUDENT_COOKIE,
                },
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if lab is deleted and unopen, requester is admin',
        func: async (dataSource: DataSource) => {
            const lab = await getLabByName(dataSource, 'GlLabDUo');

            const res = await axios({
                method: 'get',
                url: `/lab/${lab.name}`,
                headers: {
                    Cookie: STUDENT_COOKIE,
                },
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },

    {
        name: 'should throw 404 if the lab does not exist',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: `/lab/GlLabNotExist`,
                headers: {
                    Cookie: ADMIN_COOKIE,
                },
            });

            expect(res.status).equal(404);
            expect(res.data).to.be.empty;
        },
    },
];
