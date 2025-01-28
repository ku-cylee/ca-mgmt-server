import { it } from 'mocha';

export interface Test {
    name: string;
    func: () => Promise<void>;
}

export const executeTests = (tests: Test[]) => {
    tests.forEach(test => {
        const { name, func } = test;
        it(name, async () => {
            await func();
        });
    });
};
