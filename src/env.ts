import dotenv from 'dotenv';

const suffix = (env: string | undefined) => {
    switch (env) {
        case 'dev':
            return '.dev';
        case 'test':
            return '.test';
        default:
            return '';
    }
};

const envPath = `.env${suffix(process.env.NODE_ENV)}`;

dotenv.config({ path: envPath });
