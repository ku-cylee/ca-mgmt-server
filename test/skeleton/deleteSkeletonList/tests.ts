/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { DataSource } from 'typeorm';
import { Test } from '../../commons';
import { getCookie } from '../../commons/cookie';
import { SkeletonFile } from '../../../src/models';
import { admin } from '../admin';
import { otherTaUser, studentUser, taUser } from './mock';

const getSkeletonsByLab = async (
    dataSource: DataSource,
    labName: string,
): Promise<SkeletonFile[]> => {
    const repo = dataSource.getRepository(SkeletonFile);
    const skeletons = await repo.findBy({
        lab: {
            name: labName,
        },
        deletedAt: 0,
    });
    return skeletons;
};

export const tests: Test[] = [
    {
        name: 'should respond 200 if the lab is undeleted and the requester is admin',
        func: async (dataSource: DataSource) => {
            const labName = 'DlSkelUndAdmin';

            const res = await axios({
                method: 'delete',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(admin),
                },
                params: {
                    labName,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(dataSource, labName);
            expect(skeletons).to.be.empty;
        },
    },
    {
        name: 'should respond 200 if the lab is undeleted and the requester is ta and the author of the lab',
        func: async (dataSource: DataSource) => {
            const labName = 'DlSkelUndTa';

            const res = await axios({
                method: 'delete',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(dataSource, labName);
            expect(skeletons).to.be.empty;
        },
    },
    {
        name: 'should throw 403 if the lab is undeleted and the requester is ta but not the author of the lab',
        func: async (dataSource: DataSource) => {
            const labName = 'DlSkelUndOther';

            const res = await axios({
                method: 'delete',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(otherTaUser),
                },
                params: {
                    labName,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(dataSource, labName);
            expect(skeletons).to.be.not.empty;
        },
    },
    {
        name: 'should respond 200 if the lab is deleted and the requester is admin',
        func: async (dataSource: DataSource) => {
            const labName = 'DlSkelDelAdmin';

            const res = await axios({
                method: 'delete',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(admin),
                },
                params: {
                    labName,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(dataSource, labName);
            expect(skeletons).to.be.empty;
        },
    },
    {
        name: 'should respond 404 if the lab is deleted and the requester is ta and the author of the lab',
        func: async (dataSource: DataSource) => {
            const labName = 'DlSkelDelTa';

            const res = await axios({
                method: 'delete',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(dataSource, labName);
            expect(skeletons).to.be.not.empty;
        },
    },
    {
        name: 'should throw 404 if the lab is deleted and the requester is ta but not the author of the lab',
        func: async (dataSource: DataSource) => {
            const labName = 'DlSkelDelOther';

            const res = await axios({
                method: 'delete',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(otherTaUser),
                },
                params: {
                    labName,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(dataSource, labName);
            expect(skeletons).to.be.not.empty;
        },
    },
    {
        name: 'should 404 if the lab does not exist and the requester is admin',
        func: async () => {
            const labName = 'DlSkelNotExistAdmin';

            const res = await axios({
                method: 'delete',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(admin),
                },
                params: {
                    labName,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should 404 if the lab does not exist and the requester is ta',
        func: async () => {
            const labName = 'DlSkelNotExistTa';

            const res = await axios({
                method: 'delete',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 403 if the requester is student',
        func: async (dataSource: DataSource) => {
            const labName = 'DlSkelUndStdnt';

            const res = await axios({
                method: 'delete',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(studentUser),
                },
                params: {
                    labName,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(dataSource, labName);
            expect(skeletons).to.be.not.empty;
        },
    },
];
