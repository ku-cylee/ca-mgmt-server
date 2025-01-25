/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { DataSource } from 'typeorm';
import { Test } from '../../commons';
import { getCookie } from '../../commons/cookie';
import { admin } from '../admin';
import { duplicateLab, studentUser, taUser } from './mock';
import { Lab } from '../../../src/models';

const TA_COOKIE = getCookie(taUser);

const getLabByName = async (dataSource: DataSource, name: string): Promise<Lab | null> => {
    const repo = dataSource.getRepository(Lab);
    const lab = await repo.findOneBy({ name });
    return lab;
};

export const tests: Test[] = [
    {
        name: 'should respond 403 if requester is admin',
        func: async () => {
            const res = await axios({
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: getCookie(admin),
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 200 if requester is ta and openAt < dueDate < closeAt',
        func: async (dataSource: DataSource) => {
            const baseTime = Date.now();

            const res = await axios({
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: ' CLabOdcTa1 ',
                    openAt: baseTime,
                    dueDate: baseTime + 1000 * 3600,
                    closeAt: baseTime + 2000 * 3600,
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
            expect(res.data.name).to.equal('CLabOdcTa1');
            expect(res.data.openAt).to.equal(baseTime);
            expect(res.data.dueDate).to.equal(baseTime + 1000 * 3600);
            expect(res.data.closeAt).to.equal(baseTime + 2000 * 3600);
            expect(res.data.deletedAt).to.equal(0);

            const lab = await getLabByName(dataSource, 'CLabOdcTa1');
            expect(lab).to.be.not.null;
        },
    },
    {
        name: 'should respond 200 if requester is ta and openAt < dueDate = closeAt',
        func: async (dataSource: DataSource) => {
            const baseTime = Date.now();

            const res = await axios({
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabOdcTa2',
                    openAt: baseTime,
                    dueDate: baseTime + 1000 * 3600,
                    closeAt: baseTime + 1000 * 3600,
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
            expect(res.data.name).to.equal('CLabOdcTa2');
            expect(res.data.openAt).to.equal(baseTime);
            expect(res.data.dueDate).to.equal(baseTime + 1000 * 3600);
            expect(res.data.closeAt).to.equal(baseTime + 1000 * 3600);
            expect(res.data.deletedAt).to.equal(0);

            const lab = await getLabByName(dataSource, 'CLabOdcTa2');
            expect(lab).to.be.not.null;
        },
    },
    {
        name: 'should respond 403 if requester is student',
        func: async () => {
            const res = await axios({
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: getCookie(studentUser),
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should respond 400 if name is not given and requester is ta',
        func: async () => {
            const res = await axios({
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    openAt: Date.now() + 1000 * 3600,
                    dueDate: Date.now() + 2000 * 3600,
                    closeAt: Date.now() + 3000 * 3600,
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLab_NameInv',
                    openAt: Date.now() + 1000 * 3600,
                    dueDate: Date.now() + 2000 * 3600,
                    closeAt: Date.now() + 3000 * 3600,
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabNameExceedCLabNameExceedCLabNameExceed',
                    openAt: Date.now() + 1000 * 3600,
                    dueDate: Date.now() + 2000 * 3600,
                    closeAt: Date.now() + 3000 * 3600,
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabOpenNotEx',
                    dueDate: Date.now() + 2000 * 3600,
                    closeAt: Date.now() + 3000 * 3600,
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabOpenInv',
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabDueNotEx',
                    openAt: Date.now() + 1000 * 3600,
                    closeAt: Date.now() + 3000 * 3600,
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabDueInv',
                    openAt: Date.now() + 1000 * 3600,
                    dueDate: '2030-01-01',
                    closeAt: Date.now() + 3000 * 3600,
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabCloseNotEx',
                    openAt: Date.now() + 1000 * 3600,
                    dueDate: Date.now() + 2000 * 3600,
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabCloseInv',
                    openAt: Date.now() + 1000 * 3600,
                    dueDate: Date.now() + 2000 * 3600,
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabOcd',
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabDoc',
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabDco',
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabCod',
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabCdo',
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: 'CLabODc',
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
                method: 'post',
                url: '/lab',
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    name: duplicateLab.name,
                    openAt: baseTime + 1000,
                    dueDate: baseTime + 2000,
                    closeAt: baseTime + 3000,
                },
            });

            expect(res.status).to.equal(409);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, duplicateLab.name);
            expect(lab).to.be.not.null;
            expect(lab?.openAt).to.be.not.equal(baseTime + 1000);
        },
    },
];
