/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { DataSource } from 'typeorm';
import { Test } from '../../commons';
import { otherTaUser, studentUser, taUser } from './mock';
import { getCookie } from '../../commons/cookie';
import { admin } from '../admin';
import { Lab } from '../../../src/models';

const TA_COOKIE = getCookie(taUser);

const getLabByName = async (dataSource: DataSource, name: string): Promise<Lab | null> => {
    const repo = dataSource.getRepository(Lab);
    const lab = await repo.findOneBy({ name });
    return lab;
};

export const tests: Test[] = [
    {
        name: 'should throw 403 if requester is admin',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'put',
                url: `/lab/ULabOrigAdmin`,
                headers: {
                    Cookie: getCookie(admin),
                },
                data: {
                    name: 'ULabOrigAdminN',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            expect(await getLabByName(dataSource, 'ULabOrigAdmin')).to.be.not.null;
            expect(await getLabByName(dataSource, 'ULabOrigAdminN')).to.be.null;
        },
    },
    {
        name: 'should respond updated lab data if requester is ta and the requester is the author of the lab',
        func: async (dataSource: DataSource) => {
            const curTime = Date.now();

            const origLab = await getLabByName(dataSource, 'ULabOrigTa');
            if (!origLab) throw new Error();

            const res = await axios({
                method: 'put',
                url: `/lab/ULabOrigTa`,
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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

            const lab = await getLabByName(dataSource, 'ULabOrigTaN');
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
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'put',
                url: `/lab/ULabOrigStudent`,
                headers: {
                    Cookie: getCookie(studentUser),
                },
                data: {
                    name: 'ULabOrigStudentN',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            expect(await getLabByName(dataSource, 'ULabOrigStudent')).to.be.not.null;
            expect(await getLabByName(dataSource, 'ULabOrigStudentN')).to.be.null;
        },
    },
    {
        name: 'should throw 404 if the lab does not exist and the requester is ta',
        func: async () => {
            const res = await axios({
                method: 'put',
                url: `/lab/ULabNotExist`,
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
        func: async (dataSource: DataSource) => {
            await dataSource
                .getRepository(Lab)
                .update({ name: 'ULabDeleted' }, { deletedAt: Date.now() });

            const res = await axios({
                method: 'put',
                url: `/lab/ULabDeleted`,
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'put',
                url: `/lab/ULabOther`,
                headers: {
                    Cookie: getCookie(otherTaUser),
                },
                data: {
                    name: 'ULabOtherN',
                    openAt: Date.now() + 1000,
                    dueDate: Date.now() + 2000,
                    closeAt: Date.now() + 3000,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'ULabOther');
            expect(lab).to.be.not.null;
        },
    },
    {
        name: 'should respond 400 if name is not given and requester is ta',
        func: async () => {
            const res = await axios({
                method: 'put',
                url: '/lab/ULabNameNotEx',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
            const res = await axios({
                method: 'put',
                url: '/lab/ULabNameInv',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
            const res = await axios({
                method: 'put',
                url: '/lab/ULabNameExceed',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
            const res = await axios({
                method: 'put',
                url: '/lab/ULabOpenNotEx',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
            const res = await axios({
                method: 'put',
                url: '/lab/ULabOpenInv',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
            const res = await axios({
                method: 'put',
                url: '/lab/ULabDueNotEx',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
            const res = await axios({
                method: 'put',
                url: '/lab/ULabDueInv',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
            const res = await axios({
                method: 'put',
                url: '/lab/ULabCloseNotEx',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
            const res = await axios({
                method: 'put',
                url: '/lab/ULabCloseInv',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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

            const res = await axios({
                method: 'put',
                url: '/lab/ULabOcd',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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

            const res = await axios({
                method: 'put',
                url: '/lab/ULabDoc',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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

            const res = await axios({
                method: 'put',
                url: '/lab/ULabDco',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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

            const res = await axios({
                method: 'put',
                url: '/lab/ULabCod',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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

            const res = await axios({
                method: 'put',
                url: '/lab/ULabCdo',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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

            const res = await axios({
                method: 'put',
                url: '/lab/ULabODc',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
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
        func: async (dataSource: DataSource) => {
            const baseTime = Date.now();

            const res = await axios({
                method: 'put',
                url: '/lab/ULabDupOrig',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'ULabDupNew',
                    openAt: baseTime + 1000,
                    dueDate: baseTime + 2000,
                    closeAt: baseTime + 3000,
                },
            });

            expect(res.status).to.equal(409);
            expect(res.data).to.be.empty;

            const origLab = await getLabByName(dataSource, 'ULabDupOrig');
            expect(origLab).to.be.not.null;
            const newLab = await getLabByName(dataSource, 'ULabDupNew');
            expect(newLab).to.be.not.null;
            expect(newLab?.id).to.be.not.equal(origLab?.id);
        },
    },
];
