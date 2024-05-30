import User from '../models/user';

declare global {
    namespace Express {
        interface Locals {
            requester: User;
        }
    }
}
