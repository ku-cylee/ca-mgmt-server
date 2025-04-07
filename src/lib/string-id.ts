/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
import crypto from 'crypto';

export const createStringId = async (
    length: number,
    duplicateCheckFn: (id: string) => Promise<boolean>,
): Promise<string> => {
    while (true) {
        const text = Date.now().toString();
        const hash = crypto
            .createHash('sha256')
            .update(text)
            .digest('hex')
            .slice(0, length);

        const isDuplicateId = await duplicateCheckFn(hash);
        if (!isDuplicateId) return hash;
    }
};
