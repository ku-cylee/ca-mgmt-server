/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { admin, Test } from '../../commons';
import { request } from './request';
import { SubmissionFile } from '../../../src/models';
import { dataSource } from '../database';
import {
    delDelSbfMocks,
    delUndSbfMocks,
    otherTaUser,
    studentUser,
    taUser,
    undDelSbfMocks,
    undUndSbfMocks,
} from './mock';

const getSbfsByLab = async (labName: string): Promise<SubmissionFile[]> => {
    const repo = dataSource.getRepository(SubmissionFile);
    const submissionFiles = await repo.find({
        where: {
            lab: {
                name: labName,
            },
        },
        order: {
            createdAt: 'ASC',
            id: 'ASC',
        },
    });
    return submissionFiles;
};

export const tests: Test[] = [
    {
        name: 'should throw 403 if requester is admin',
        func: async () => {
            const labName = 'CSbfAdmin';
            const res = await request({
                requester: admin,
                query: {
                    labName,
                },
                body: {
                    names: [],
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 403 if requester is student',
        func: async () => {
            const labName = 'CSbfStudent';
            const res = await request({
                requester: studentUser,
                query: {
                    labName,
                },
                body: {
                    names: [],
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if the lab does not exist',
        func: async () => {
            const labName = 'CSbfNotExist';
            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
                body: {
                    names: [],
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if the lab is deleted',
        func: async () => {
            const labName = 'CSbfDeleted';
            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
                body: {
                    names: [],
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 403 if requester is ta but not the author of the lab',
        func: async () => {
            const labName = 'CSbfOther';
            const res = await request({
                requester: otherTaUser,
                query: {
                    labName,
                },
                body: {
                    names: [],
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if labName is not given',
        func: async () => {
            const res = await request({
                requester: taUser,
                query: {},
                body: {
                    names: [],
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if names is not given',
        func: async () => {
            const labName = 'CSbfNamesNotEx';
            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
                body: {},
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if names is invalid',
        func: async () => {
            const labName = 'CSbfNamesInvalid';
            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
                body: {
                    names: 'names',
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if any name of names exceed maxlength of 32',
        func: async () => {
            const labName = 'CSbfNamesExceed';
            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
                body: {
                    names: [
                        'csbf_names_exceed_1.v',
                        'csbf_names_exceed_csbf_names__2.v',
                        'csbf_names_exceed_3.v',
                        'csbf_names_exceed_4.v',
                        'csbf_names_exceed_5.v',
                    ],
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should return updated submission file list if requester is ta and the author of the lab',
        func: async () => {
            const baseTime = Date.now();

            const labName = 'CSbfTa';

            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
                body: {
                    names: [
                        'und_und_1.v',
                        'und_und_2.v',
                        '  del_und_1.v ',
                        'del_und_2.v',
                        '  new_1.v ',
                        'new_2.v',
                    ],
                },
            });

            const newNames = ['new_1.v', 'new_2.v'];

            const expectedLength = undUndSbfMocks.length + undDelSbfMocks.length + newNames.length;

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expectedLength);

            res.data.forEach((actual: any, idx: number) => {
                expect(actual.id).to.be.a('number');
                expect(actual.name).to.be.a('string');
                expect(actual.createdAt).to.be.a('number');
                if (idx < undUndSbfMocks.length) expect(actual.createdAt).to.be.lessThan(baseTime);
                else expect(actual.createdAt).to.be.greaterThan(baseTime);
            });

            expect(res.data.map((a: any) => a.name)).to.have.members([
                ...undUndSbfMocks.map(sbf => sbf.name),
                ...delUndSbfMocks.map(sbf => sbf.name),
                ...newNames,
            ]);

            Array(expectedLength - 1).forEach(idx => {
                const prev = res.data[idx];
                const next = res.data[idx + 1];
                expect(prev.createdAt).to.be.lessThanOrEqual(next.createdAt);
            });

            const submissionFiles = await getSbfsByLab(labName);
            expect(submissionFiles).to.have.lengthOf(
                expectedLength + delUndSbfMocks.length + delDelSbfMocks.length,
            );
            const undeletedSbfs = submissionFiles.filter(sbf => !sbf.isDeleted);
            expect(undeletedSbfs).to.have.lengthOf(expectedLength);
            expect(undeletedSbfs.map(sbf => sbf.name)).to.have.members(
                res.data.map((a: any) => a.name),
            );
        },
    },
];
