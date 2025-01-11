export const stringToEnum = <T>(
    enm: { [s: string]: T },
    value: string,
): T | undefined => {
    return (Object.values(enm) as unknown as string[]).includes(value)
        ? (value as unknown as T)
        : undefined;
};

export enum UserRole {
    STUDENT = 'student',
    TA = 'ta',
    ADMIN = 'admin',
}
