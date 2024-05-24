import crypto from 'crypto';

export const getChecksum = (text: string): string =>
    crypto.createHash('md5').update(text).digest('base64');
