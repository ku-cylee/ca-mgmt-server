import axios from 'axios';
import { it } from 'mocha';
import path from 'path';

const { PORT } = process.env;

export interface Test {
    name: string;
    func: () => Promise<void>;
}

export const initAxios = () => {
    axios.defaults.baseURL = path.join(`http://localhost:${PORT}`);
    axios.defaults.validateStatus = _status => true;
};

export const executeTests = (tests: Test[]) => {
    tests.forEach(test => {
        const { name, func } = test;
        it(name, async () => {
            await func();
        });
    });
};
