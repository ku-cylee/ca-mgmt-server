/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { expect } from 'chai';
import { getCookie } from '../../commons/cookie';
import { Test } from '../../commons/tests';
import { admin } from '../admin';
import { getChecksum } from '../../../src/lib/checksum';
import { SkeletonFile } from '../../../src/models';
import { otherTaUser, taUser } from './mock';
import { dataSource } from '../database';

const getSkeletonByLabAndPath = async (
    labName: string,
    path: string,
): Promise<SkeletonFile | null> => {
    const repo = dataSource.getRepository(SkeletonFile);
    const skeleton = await repo.findOneBy({
        lab: {
            name: labName,
        },
        path,
        deletedAt: 0,
    });
    return skeleton;
};

const compare = (actual: any, expected: any) => {
    expect(actual.id).to.be.a('number');
    expect(actual.path).to.be.a('string');
    expect(actual.checksum).to.be.a('string');
    expect(actual.isExecutable).to.be.a('boolean');
    expect(actual.createdAt).to.be.a('number');
    expect(actual.deletedAt).to.be.a('number');

    expect(actual.path).to.equal(expected.path);
    expect(actual.checksum).to.equal(getChecksum(expected.content));
    expect(actual.isExecutable).to.equal(expected.isExecutable);
    if (expected.isDeleted) expect(actual.deletedAt).to.not.equal(0);
    else expect(actual.deletedAt).to.equal(0);
};

export const tests: Test[] = [
    {
        name: 'should throw 403 if requester is admin',
        func: async () => {
            const labName = 'CSkelUndeleted';
            const path = '/src/cskel_admin.v';
            const content = 'CSkel\nAdmin\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(admin),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const skeleton = await getSkeletonByLabAndPath(labName, path);
            expect(skeleton).to.be.null;
        },
    },
    {
        name: 'should respond created skeleton if requester is ta and the author of the lab and the duplicate skeleton file does not exist',
        func: async () => {
            const labName = 'CSkelUndeleted';
            const path = '  /src/cskel_ta.v ';
            const content = 'CSkel\nTa\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('object');

            compare(res.data, {
                path: path.trim(),
                content,
                checksum,
                isExecutable: false,
            });

            const skeleton = await getSkeletonByLabAndPath(labName, path.trim());
            expect(skeleton).to.be.not.null;
        },
    },
    {
        name: 'should throw 403 if requester is student',
        func: async () => {
            const labName = 'CSkelUndeleted';
            const path = '/src/cskel_student.v';
            const content = 'CSkel\nStudent\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(admin),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const skeleton = await getSkeletonByLabAndPath(labName, path);
            expect(skeleton).to.be.null;
        },
    },
    {
        name: 'should throw 403 if requester is not the author of the lab',
        func: async () => {
            const labName = 'CSkelUndeleted';
            const path = '/src/cskel_other.v';
            const content = 'CSkel\nOther\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(otherTaUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(403);
            expect(res.data).to.be.empty;

            const skeleton = await getSkeletonByLabAndPath(labName, path);
            expect(skeleton).to.be.null;
        },
    },
    {
        name: 'should throw 404 if lab does not exist and the requester is ta',
        func: async () => {
            const labName = 'CSkelNotExist';
            const path = '/src/cskel_not_exist.v';
            const content = 'CSkel\nNot exist\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;

            const skeleton = await getSkeletonByLabAndPath(labName, path);
            expect(skeleton).to.be.null;
        },
    },
    {
        name: 'should throw 404 if lab is deleted and the requester is ta',
        func: async () => {
            const labName = 'CSkelDeleted';
            const path = '/src/cskel_deleted.v';
            const content = 'CSkel\nNot exist\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(404);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if path is not given',
        func: async () => {
            const labName = 'CSkelBadRequest';
            const content = 'CSkel\nBad Request\nPath not given\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if path exceeds maxlength of 128',
        func: async () => {
            const labName = 'CSkelBadRequest';
            const path =
                '/src/cskel_path_exceed_cskel_path_exceed_cskel_path_exceed_cskel_path_exceed_cskel_path_exceed_cskel_path_exceed_cskel_path_exceed.v';
            const content = 'CSkel\nBad Request\nPath exceed maxlength\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if content is not given',
        func: async () => {
            const labName = 'CSkelBadRequest';
            const path = '/src/cskel_content_not_given.v';
            const content = 'CSkel\nBad Request\nContent not given\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if content exceeds maxlength of 65536',
        func: async () => {
            const labName = 'CSkelBadRequest';
            const path = `src/cskel_content_exceed.v`;
            const content = 'CSkel\nBad Request\nContent exceed maxlength\nContent\n'.repeat(1286);
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if checksum is not given',
        func: async () => {
            const labName = 'CSkelBadRequest';
            const path = `src/cskel_checksum_not_given.v`;
            const content = 'CSkel\nBad Request\nChecksum not given\nContent\n';

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if checksum exceeds maxlength of 16',
        func: async () => {
            const labName = 'CSkelBadRequest';
            const path = `src/cskel_checksum_exceed.v`;
            const content = 'CSkel\nBad Request\nChecksum exceed maxlength\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum: `${checksum}0`,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if isExecutable is not given',
        func: async () => {
            const labName = 'CSkelBadRequest';
            const path = `src/cskel_isExecutable_not_given.v`;
            const content = 'CSkel\nBad Request\nIsExectable not given\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 400 if isExecutable is invalid',
        func: async () => {
            const labName = 'CSkelBadRequest';
            const path = `src/cskel_isExecutable_invalid.v`;
            const content = 'CSkel\nBad Request\nIsExectable invalid\nContent\n';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: 'yes',
                },
            });

            expect(res.status).to.equal(400);
            expect(res.data).to.be.empty;
        },
    },
    {
        name: 'should throw 409 if undeleted, duplicate skeleton file exists and requester is the author of the lab',
        func: async () => {
            const labName = 'CSkelDuplicate';
            const path = '/src/cskel_duplicate.v';
            const content = 'CSkelDuplicate.v New Content';
            const checksum = getChecksum(content);

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable: false,
                },
            });

            expect(res.status).to.equal(409);
            expect(res.data).to.be.empty;

            const skeleton = await getSkeletonByLabAndPath(labName, path);
            expect(skeleton?.content).to.not.equal(content);
        },
    },
    {
        name: 'should respond created skeleton if deleted, duplicate skeleton file exists and requester is the author of the lab',
        func: async () => {
            const labName = 'CSkelDuplicate';
            const path = '/src/cskel_duplicate_deleted.v';
            const content = 'CSkelDuplicate.v Deleted New Content';
            const checksum = getChecksum(content);
            const isExecutable = false;

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('object');

            compare(res.data, { path, content, checksum, isExecutable });

            const skeleton = await getSkeletonByLabAndPath(labName, path);
            expect(skeleton).to.be.not.null;
            expect(skeleton?.checksum).to.equal(checksum);
        },
    },
    {
        name: 'should respond created skeleton and the author of the lab and the duplicate skeleton file exists on another lab',
        func: async () => {
            const labName = 'CSkelOne';
            const path = '/src/cskel_another.v';
            const content = 'CSkelOne.v Content';
            const checksum = getChecksum(content);
            const isExecutable = false;

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable,
                },
            });

            expect(res.status).to.equal(200);
            expect(res.data).to.be.an('object');

            compare(res.data, { path, content, checksum, isExecutable });

            const skeleton = await getSkeletonByLabAndPath(labName, path);
            expect(skeleton).to.be.not.null;
            expect(skeleton?.checksum).to.equal(checksum);
        },
    },
    {
        name: 'should throw 422 if checksum does not match',
        func: async () => {
            const labName = 'CSkelChecksum';
            const path = '/src/cskel_checksum_mismatch.v';
            const content = 'CSkelChecksum.v\nMismatch\nContent\n';
            const checksum = getChecksum(content.slice(0, -2));
            const isExecutable = false;

            const res = await axios({
                method: 'post',
                url: '/skeleton',
                headers: {
                    Cookie: getCookie(taUser),
                },
                params: {
                    labName,
                },
                data: {
                    path,
                    content,
                    checksum,
                    isExecutable,
                },
            });

            expect(res.status).to.equal(422);
            expect(res.data).to.be.empty;

            const skeleton = await getSkeletonByLabAndPath(labName, path);
            expect(skeleton).to.be.null;
        },
    },
];
