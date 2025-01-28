import { Router } from 'express';
import { createUserList, deleteUser, getUserList } from './ctrl';

const router = Router();

router.get('/', getUserList);

router.post('/', createUserList);

router.delete('/:username', deleteUser);

export default router;
