/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { DataSource } from 'typeorm';
import { Test } from '../../commons';
import { otherTaUser, studentUser, taUser } from './mock';
import { getCookie } from '../../commons/cookie';
import { Lab } from '../../../src/models';
import { admin } from '../admin';

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
                method: 'patch',
                url: `/lab/UsfLabOrigAdmin`,
                headers: {
                    Cookie: getCookie(admin),
                },
                data: {
                    submissionFiles: [
                        'UsfLabOrigAdmin_3.v',
                        ' UsfLabOrigAdmin_4.v  ',
                        'UsfLabOrigAdmin_5.v',
                    ],
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'UsfLabOrigAdmin');
            expect(lab?.submissionFiles).to.deep.equal([
                'UsfLabOrigAdmin_1.v',
                'UsfLabOrigAdmin_2.v',
            ]);
        },
    },
    {
        name: 'should respond updated lab data if requester is ta and the requester is the author of the lab',
        func: async (dataSource: DataSource) => {
            const origLab = await getLabByName(dataSource, 'UsfLabOrigTa');
            if (!origLab) throw new Error();

            const res = await axios({
                method: 'patch',
                url: `/lab/UsfLabOrigTa`,
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    submissionFiles: [
                        'UsfLabOrigTa_3.v',
                        ' UsfLabOrigTa_4.v  ',
                        'UsfLabOrigTa_5.v',
                    ],
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('object');
            expect(res.data.id).to.be.a('number');
            expect(res.data.name).to.be.a('string');
            expect(res.data.openAt).to.be.a('number');
            expect(res.data.dueDate).to.be.a('number');
            expect(res.data.closeAt).to.be.a('number');
            expect(res.data.submissionFiles).to.be.an('array');
            expect(res.data.author).to.be.an('object');
            expect(res.data.author.username).to.be.a('string');
            expect(res.data.createdAt).to.be.a('number');
            expect(res.data.updatedAt).to.be.a('number');
            expect(res.data.deletedAt).to.be.a('number');
            expect(res.data.name).to.equal('UsfLabOrigTa');
            expect(res.data.submissionFiles).to.be.deep.equal([
                'UsfLabOrigTa_3.v',
                'UsfLabOrigTa_4.v',
                'UsfLabOrigTa_5.v',
            ]);
            expect(res.data.author.username).to.equal(taUser.username);

            const lab = await getLabByName(dataSource, 'UsfLabOrigTa');
            expect(lab).to.be.not.null;
            expect(lab?.name).to.equal(origLab.name);
            expect(lab?.openAt).to.equal(origLab.openAt);
            expect(lab?.dueDate).to.equal(origLab.dueDate);
            expect(lab?.closeAt).to.equal(origLab.closeAt);
            expect(lab?.submissionFiles).to.be.deep.equal([
                'UsfLabOrigTa_3.v',
                'UsfLabOrigTa_4.v',
                'UsfLabOrigTa_5.v',
            ]);
            expect(lab?.createdAt).to.equal(origLab.createdAt);
            expect(lab?.updatedAt).to.be.above(origLab.updatedAt);
        },
    },
    {
        name: 'should throw 403 if requester is student',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'patch',
                url: `/lab/UsfLabOrigStudent`,
                headers: {
                    Cookie: getCookie(studentUser),
                },
                data: {
                    submissionFiles: [
                        'UsfLabOrigStudent_3.v',
                        ' UsfLabOrigStudent_4.v  ',
                        'UsfLabOrigStudent_5.v',
                    ],
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'UsfLabOrigStudent');
            expect(lab?.submissionFiles).to.deep.equal([
                'UsfLabOrigStudent_1.v',
                'UsfLabOrigStudent_2.v',
            ]);
        },
    },
    {
        name: 'should throw 404 if the lab does not exist and the requester is ta',
        func: async () => {
            const res = await axios({
                method: 'patch',
                url: `/lab/UsfLabNotExist`,
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    submissionFiles: [
                        'UsfLabNotExist_3.v',
                        ' UsfLabNotExist_4.v  ',
                        'UsfLabNotExist_5.v',
                    ],
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
                .update({ name: 'UsfLabDeleted' }, { deletedAt: Date.now() });

            const res = await axios({
                method: 'patch',
                url: `/lab/UsfLabDeleted`,
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    submissionFiles: [
                        'UsfLabDeleted_3.v',
                        ' UsfLabDeleted_4.v  ',
                        'UsfLabDeleted_5.v',
                    ],
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
                method: 'patch',
                url: `/lab/UsfLabOther`,
                headers: {
                    Cookie: getCookie(otherTaUser),
                },
                data: {
                    submissionFiles: ['UsfLabOther_3.v', ' UsfLabOther_4.v  ', 'UsfLabOther_5.v'],
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'UsfLabOther');
            expect(lab?.submissionFiles).to.deep.equal(['UsfLabOther_1.v', 'UsfLabOther_2.v']);
        },
    },
    {
        name: 'should throw 400 if submissionFiles contain a string containing comma and the requester is ta',
        func: async (dataSource: DataSource) => {
            const res = await axios({
                method: 'patch',
                url: `/lab/UsfLabInvalid`,
                headers: {
                    Cookie: TA_COOKIE,
                },
                data: {
                    submissionFiles: [
                        'UsfLabInvalid_3.v',
                        ' UsfLabInvalid,4.v  ',
                        'UsfLabInvalid_5.v',
                    ],
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;

            const lab = await getLabByName(dataSource, 'UsfLabInvalid');
            expect(lab?.submissionFiles).to.deep.equal(['UsfLabInvalid_1.v', 'UsfLabInvalid_2.v']);
        },
    },
];
