/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { admin, Test } from '../../commons';
import { otherTaUser, studentUser, taUser } from './mock';
import { Lab } from '../../../src/models';
import { dataSource } from '../database';
import { request } from './request';

const getLabByName = async (name: string): Promise<Lab | null> => {
    const repo = dataSource.getRepository(Lab);
    const lab = await repo.findOneBy({ name });
    return lab;
};

export const tests: Test[] = [
    {
        name: 'should respond 200 if the requester is admin',
        func: async () => {
            const labName = 'DLabOrigAdmin';

            const res = await request({
                params: {
                    labName,
                },
                requester: admin,
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(labName);
            expect(lab?.deletedAt).to.be.not.equal(0);
        },
    },
    {
        name: 'should respond 200 if the requester is ta and the requester is the author of the lab',
        func: async () => {
            const labName = 'DLabOrigTa';

            const res = await request({
                params: {
                    labName,
                },
                requester: taUser,
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(labName);
            expect(lab?.deletedAt).to.be.not.equal(0);
        },
    },
    {
        name: 'should throw 403 if the requester is student',
        func: async () => {
            const labName = 'DLabOrigStudent';

            const res = await request({
                params: {
                    labName,
                },
                requester: studentUser,
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(labName);
            expect(lab?.deletedAt).to.be.equal(0);
        },
    },
    {
        name: 'should throw 404 if the lab does not exist',
        func: async () => {
            const labName = 'DLabNotExist';

            const res = await request({
                params: {
                    labName,
                },
                requester: taUser,
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if the lab is deleted',
        func: async () => {
            const labName = 'DLabDeleted';

            await dataSource
                .getRepository(Lab)
                .update({ name: labName }, { deletedAt: Date.now() });

            const res = await request({
                params: {
                    labName,
                },
                requester: taUser,
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(labName);
            expect(lab?.deletedAt).to.be.not.equal(0);
        },
    },
    {
        name: 'should throw 403 if the requester is ta and the requester is not the author of the lab',
        func: async () => {
            const labName = 'DLabOther';

            const res = await request({
                params: {
                    labName,
                },
                requester: otherTaUser,
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(labName);
            expect(lab?.deletedAt).to.be.equal(0);
        },
    },
];
