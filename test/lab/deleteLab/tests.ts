/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { DataSource } from 'typeorm';
import { Test } from '../../commons';
import { getCookie } from '../../commons/cookie';
import { otherTaUser, studentUser, taUser } from './mock';
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
        name: 'should respond 200 if the requester is admin',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'delete',
                url: `/lab/DLabOrigAdmin`,
                headers: {
                    Cookie: getCookie(admin),
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'DLabOrigAdmin');
            expect(lab?.deletedAt).to.be.not.equal(0);
        },
    },
    {
        name: 'should respond 200 if the requester is ta and the requester is the author of the lab',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'delete',
                url: `/lab/DLabOrigTa`,
                headers: {
                    Cookie: TA_COOKIE,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'DLabOrigTa');
            expect(lab?.deletedAt).to.be.not.equal(0);
        },
    },
    {
        name: 'should throw 403 if the requester is student',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'delete',
                url: `/lab/DLabOrigStudent`,
                headers: {
                    Cookie: getCookie(studentUser),
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'DLabOrigStudent');
            expect(lab?.deletedAt).to.be.equal(0);
        },
    },
    {
        name: 'should throw 404 if the lab does not exist',
        func: async () => {
            const res = await axios({
                method: 'delete',
                url: `/lab/DLabNotExist`,
                headers: {
                    Cookie: TA_COOKIE,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 404 if the lab is deleted',
        func: async (dataSource: DataSource) => {
            await dataSource
                .getRepository(Lab)
                .update({ name: 'DLabDeleted' }, { deletedAt: Date.now() });

            const res = await axios({
                method: 'delete',
                url: `/lab/DLabDeleted`,
                headers: {
                    Cookie: TA_COOKIE,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'DLabDeleted');
            expect(lab?.deletedAt).to.be.not.equal(0);
        },
    },
    {
        name: 'should throw 403 if the requester is ta and the requester is not the author of the lab',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'delete',
                url: `/lab/DLabOther`,
                headers: {
                    Cookie: getCookie(otherTaUser),
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'DLabOther');
            expect(lab?.deletedAt).to.be.equal(0);
        },
    },
];
