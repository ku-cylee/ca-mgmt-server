import axios from 'axios';
import { expect } from 'chai';
import { Test } from '../../commons';
import {
    deletedOpenLabs,
    deletedUnopenLabs,
    studentUser,
    taUsers,
    undeletedOpenLabs,
    undeletedUnopenLabs,
} from './mock';

const { ADMIN_USERNAME, ADMIN_SECRETKEY } = process.env;

const compareLabs = (actual: any, expected: any) => {
    expect(actual).to.be.an('object');
    expect(actual).to.have.all.keys(
        'id',
        'name',
        'openAt',
        'dueDate',
        'closeAt',
        'submissionFiles',
        'author',
        'createdAt',
        'updatedAt',
        'deletedAt',
    );
    expect(actual.id).to.be.a('number');
    expect(actual.name).to.be.a('string');
    expect(actual.openAt).to.be.a('number');
    expect(actual.dueDate).to.be.a('number');
    expect(actual.closeAt).to.be.a('number');
    expect(actual.submissionFiles).to.be.an('array');
    expect(actual.author).to.be.an('object');
    expect(actual.createdAt).to.be.a('number');
    expect(actual.updatedAt).to.be.a('number');
    expect(actual.deletedAt).to.be.a('number');

    expect(actual.name).to.equal(expected.name);
    expect(actual.openAt).to.equal(expected.openAt);
    expect(actual.dueDate).to.equal(expected.dueDate);
    expect(actual.closeAt).to.equal(expected.closeAt);
    expect(actual.submissionFiles).to.deep.equal(expected.submissionFiles);
    expect(actual.author).to.have.key('username');
    expect(actual.author.username).to.equal(expected.authorUsername);
    expect(actual.deletedAt).to.equal(expected.deletedAt);
};

export const tests: Test[] = [
    {
        name: 'should respond all labs if the requester is admin',
        func: async () => {
            const res = await axios({
                method: 'get',
                url: '/lab',
                headers: {
                    Cookie: `username=${ADMIN_USERNAME};secretKey=${ADMIN_SECRETKEY}`,
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
