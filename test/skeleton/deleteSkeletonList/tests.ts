/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { admin, Test } from '../../commons';
import { SkeletonFile } from '../../../src/models';
import { otherTaUser, studentUser, taUser } from './mock';
import { dataSource } from '../database';
import { request } from './request';

const getSkeletonsByLab = async (labName: string): Promise<SkeletonFile[]> => {
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
        func: async () => {
            const labName = 'DlSkelUndAdmin';

            const res = await request({
                requester: admin,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(labName);
            expect(skeletons).to.be.empty;
        },
    },
    {
        name: 'should respond 200 if the lab is undeleted and the requester is ta and the author of the lab',
        func: async () => {
            const labName = 'DlSkelUndTa';

            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(labName);
            expect(skeletons).to.be.empty;
        },
    },
    {
        name: 'should throw 403 if the lab is undeleted and the requester is ta but not the author of the lab',
        func: async () => {
            const labName = 'DlSkelUndOther';

            const res = await request({
                requester: otherTaUser,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(labName);
            expect(skeletons).to.be.not.empty;
        },
    },
    {
        name: 'should respond 200 if the lab is deleted and the requester is admin',
        func: async () => {
            const labName = 'DlSkelDelAdmin';

            const res = await request({
                requester: admin,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(labName);
            expect(skeletons).to.be.empty;
        },
    },
    {
        name: 'should respond 404 if the lab is deleted and the requester is ta and the author of the lab',
        func: async () => {
            const labName = 'DlSkelDelTa';

            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(labName);
            expect(skeletons).to.be.not.empty;
        },
    },
    {
        name: 'should throw 404 if the lab is deleted and the requester is ta but not the author of the lab',
        func: async () => {
            const labName = 'DlSkelDelOther';

            const res = await request({
                requester: otherTaUser,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(labName);
            expect(skeletons).to.be.not.empty;
        },
    },
    {
        name: 'should 404 if the lab does not exist and the requester is admin',
        func: async () => {
            const labName = 'DlSkelNotExistAdmin';

            const res = await request({
                requester: admin,
                query: {
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

            const res = await request({
                requester: taUser,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 403 if the requester is student',
        func: async () => {
            const labName = 'DlSkelUndStdnt';

            const res = await request({
                requester: studentUser,
                query: {
                    labName,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const skeletons = await getSkeletonsByLab(labName);
            expect(skeletons).to.be.not.empty;
        },
    },
];
