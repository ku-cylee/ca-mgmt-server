import axios from 'axios';
import { expect } from 'chai';
import {
    deletedOpenLabs,
    deletedUnopenLabs,
    studentUser,
    taUsers,
    undeletedOpenLabs,
    undeletedUnopenLabs,
} from './mock';
import { getCookie } from '../../commons/cookie';
import { admin } from '../admin';
import { Test } from '../../commons/tests';

const compareLabs = (actual: any, expected: any) => {
    expect(actual).to.be.an('object');
    expect(actual).to.have.all.keys(
        'id',
        'name',
        'openAt',
        'dueDate',
        'closeAt',
        'author',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'submissionFiles',
    );
    expect(actual.id).to.be.a('number');
    expect(actual.name).to.be.a('string');
    expect(actual.openAt).to.be.a('number');
    expect(actual.dueDate).to.be.a('number');
    expect(actual.closeAt).to.be.a('number');
    expect(actual.author).to.be.an('object');
    expect(actual.createdAt).to.be.a('number');
    expect(actual.updatedAt).to.be.a('number');
    expect(actual.deletedAt).to.be.a('number');
    expect(actual.submissionFiles).to.be.an('array');

    expect(actual.name).to.equal(expected.name);
    expect(actual.openAt).to.equal(expected.openAt);
    expect(actual.dueDate).to.equal(expected.dueDate);
    expect(actual.closeAt).to.equal(expected.closeAt);
    expect(actual.author).to.have.key('username');
    expect(actual.author.username).to.equal(expected.authorUsername);
    expect(actual.deletedAt).to.equal(expected.deletedAt);

    expect(actual.submissionFiles).to.have.lengthOf(expected.submissionFilenames.length);
    actual.submissionFiles.forEach((a: any, i: number) => {
        expect(a).to.have.all.keys('id', 'name', 'createdAt');
        expect(a.id).to.be.a('number');
        expect(a.name).to.be.a('string');
        expect(a.createdAt).to.be.a('number');
        expect(a.name).to.equal(expected.submissionFilenames[i]);
    });
};

export const tests: Test[] = [
    {
        name: 'should respond all labs if the requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/lab',
                headers: {
                    Cookie: getCookie(admin),
                },
            });

            const expected = [
                ...undeletedOpenLabs,
                ...undeletedUnopenLabs,
                ...deletedOpenLabs,
                ...deletedUnopenLabs,
            ];

            expect(res.status).equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);
            res.data.forEach((user: any, idx: number) => compareLabs(user, expected[idx]));
        },
    },
    {
        name: 'should respond undeleted labs if the requester is ta',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/lab',
                headers: {
                    Cookie: `username=${taUsers[0].username};secretKey=${taUsers[0].secretKey}`,
                },
            });

            const expected = [...undeletedOpenLabs, ...undeletedUnopenLabs];

            expect(res.status).equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(expected.length);
            res.data.forEach((user: any, idx: number) => compareLabs(user, expected[idx]));
        },
    },
    {
        name: 'should respond undeleted, open labs if the requester is student',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/lab',
                headers: {
                    Cookie: `username=${studentUser.username};secretKey=${studentUser.secretKey}`,
                },
            });

            expect(res.status).equal(200);
            expect(res.data).to.be.an('array');
            expect(res.data).to.have.lengthOf(undeletedOpenLabs.length);
            res.data.forEach((user: any, idx: number) => compareLabs(user, undeletedOpenLabs[idx]));
        },
    },
];
