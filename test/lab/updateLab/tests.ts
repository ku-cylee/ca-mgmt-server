/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { otherTaUser, studentUser, taUser } from './mock';
import { admin, Test } from '../../commons';
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
        name: 'should throw 403 if requester is admin',
        func: async () => {
            const res = await request({
                requester: admin,
                params: {
                    labName: 'ULabOrigAdmin',
                },
                body: {
                    name: 'ULabOrigAdminN',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            expect(await getLabByName('ULabOrigAdmin')).to.be.not.null;
            expect(await getLabByName('ULabOrigAdminN')).to.be.null;
        },
    },
    {
        name: 'should respond updated lab data if requester is ta and the requester is the author of the lab',
        func: async () => {
            const curTime = Date.now();

            const origLab = await getLabByName('ULabOrigTa');
            if (!origLab) throw new Error();

            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabOrigTa',
                },
                body: {
                    name: ' ULabOrigTaN ',
                    openAt: curTime + 1000,
                    dueDate: curTime + 2000,
                    closeAt: curTime + 3000,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('object');
            expect(res.data.id).to.be.a('number');
            expect(res.data.name).to.be.a('string');
            expect(res.data.openAt).to.be.a('number');
            expect(res.data.dueDate).to.be.a('number');
            expect(res.data.closeAt).to.be.a('number');
            expect(res.data.createdAt).to.be.a('number');
            expect(res.data.updatedAt).to.be.a('number');
            expect(res.data.deletedAt).to.be.a('number');
            expect(res.data.name).to.equal('ULabOrigTaN');
            expect(res.data.openAt).to.equal(curTime + 1000);
            expect(res.data.dueDate).to.equal(curTime + 2000);
            expect(res.data.closeAt).to.equal(curTime + 3000);

            const lab = await getLabByName('ULabOrigTaN');
            expect(lab).to.be.not.null;
            expect(lab?.name).to.equal('ULabOrigTaN');
            expect(lab?.openAt).to.equal(curTime + 1000);
            expect(lab?.dueDate).to.equal(curTime + 2000);
            expect(lab?.closeAt).to.equal(curTime + 3000);
            expect(lab?.createdAt).to.equal(origLab.createdAt);
            expect(lab?.updatedAt).to.be.above(origLab.updatedAt);
        },
    },
    {
        name: 'should throw 403 if requester is student',
        func: async () => {
            const res = await request({
                requester: studentUser,
                params: {
                    labName: 'ULabOrigStudent',
                },
                body: {
                    name: 'ULabOrigStudentN',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            expect(await getLabByName('ULabOrigStudent')).to.be.not.null;
            expect(await getLabByName('ULabOrigStudentN')).to.be.null;
        },
    },
    {
        name: 'should throw 404 if the lab does not exist and the requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabNotExist',
                },
                body: {
                    name: 'ULabNotExistN',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if the lab is deleted and the requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabDeleted',
                },
                body: {
                    name: 'ULabDeletedN',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 403 if the author of the lab is not requester and the requester is ta',
        func: async () => {
            const res = await request({
                requester: otherTaUser,
                params: {
                    labName: 'ULabOther',
                },
                body: {
                    name: 'ULabOtherN',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const lab = await getLabByName('ULabOther');
            expect(lab).to.be.not.null;
        },
    },
    {
        name: 'should respond 400 if name is not given and requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabNameNotEx',
                },
                body: {
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if name is invalid and requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabNameInv',
                },
                body: {
                    name: 'ULab_NameInv',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if name exceeds maxlength and requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabNameExceed',
                },
                body: {
                    name: 'ULabNameExceedULabNameExceedULabNameExceed',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if openAt is not given and requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabOpenNotEx',
                },
                body: {
                    name: 'ULabOpenNotEx',
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if openAt is invalid and requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabOpenInv',
                },
                body: {
                    name: 'ULabOpenInv',
                    openAt: '2025-01-01',
                    dueDate: Date.now() + 2000 * 3600,
                    closeAt: Date.now() + 3000 * 3600,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if dueDate is not given and requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabDueNotEx',
                },
                body: {
                    name: 'ULabDueNotEx',
                    openAt: Date.now() + 1000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if dueDate is invalid and requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabDueInv',
                },
                body: {
                    name: 'ULabDueInv',
                    openAt: Date.now() + 1000,
                    dueDate: '2030-01-01',
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if closeAt is not given and requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabCloseNotEx',
                },
                body: {
                    name: 'ULabCloseNotEx',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if closeAt is invalid and requester is ta',
        func: async () => {
            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabCloseInv',
                },
                body: {
                    name: 'ULabCloseInv',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: '2031-01-01',
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if openAt < closeAt < dueDate and requester is ta',
        func: async () => {
            const baseTime = Date.now();

            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabOcd',
                },
                body: {
                    name: 'ULabOcd',
                    openAt: baseTime + 1000,
                    dueDate: baseTime + 3000,
                    closeAt: baseTime + 2000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if dueDate < openAt < closeAt and requester is ta',
        func: async () => {
            const baseTime = Date.now();

            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabDoc',
                },
                body: {
                    name: 'ULabDoc',
                    openAt: baseTime + 2000,
                    dueDate: baseTime + 1000,
                    closeAt: baseTime + 3000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if dueDate < closeAt < openAt and requester is ta',
        func: async () => {
            const baseTime = Date.now();

            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabDco',
                },
                body: {
                    name: 'ULabDco',
                    openAt: baseTime + 3000,
                    dueDate: baseTime + 1000,
                    closeAt: baseTime + 2000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if closeAt < openAt < dueDate and requester is ta',
        func: async () => {
            const baseTime = Date.now();

            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabCod',
                },
                body: {
                    name: 'ULabCod',
                    openAt: baseTime + 2000,
                    dueDate: baseTime + 3000,
                    closeAt: baseTime + 1000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if closeAt < dueDate < openAt and requester is ta',
        func: async () => {
            const baseTime = Date.now();

            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabCdo',
                },
                body: {
                    name: 'ULabCdo',
                    openAt: baseTime + 3000,
                    dueDate: baseTime + 2000,
                    closeAt: baseTime + 1000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if openAt = dueDate < closeAt and requester is ta',
        func: async () => {
            const baseTime = Date.now();

            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabODc',
                },
                body: {
                    name: 'ULabODc',
                    openAt: baseTime + 1000,
                    dueDate: baseTime + 1000,
                    closeAt: baseTime + 3000,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 409 if the lab already exists and the requester is ta',
        func: async () => {
            const baseTime = Date.now();

            const res = await request({
                requester: taUser,
                params: {
                    labName: 'ULabDupOrig',
                },
                body: {
                    name: 'ULabDupNew',
                    openAt: baseTime + 1000,
                    dueDate: baseTime + 2000,
                    closeAt: baseTime + 3000,
                },
            });

            expect(res.status).to.equal(409);
            expect(res.data).to.be.empty;

            const origLab = await getLabByName('ULabDupOrig');
            expect(origLab).to.be.not.null;
            const newLab = await getLabByName('ULabDupNew');
            expect(newLab).to.be.not.null;
            expect(newLab?.id).to.be.not.equal(origLab?.id);
        },
    },
];
