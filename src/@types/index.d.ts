import { User } from '../models';

declare global {
    namespace Express {
        interface Locals {
            requester: User;
        }
    }
}
