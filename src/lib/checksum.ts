import crypto from 'crypto';

export const getChecksum = (text: string, length = 16): string =>
    crypto.createHash('sha256').update(text).digest('base64').slice(0, length);
