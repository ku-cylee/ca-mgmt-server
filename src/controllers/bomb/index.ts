import { Router } from 'express';
import { getBombList, createBomb, getBombFileByLongId } from './ctrl';

const router = Router();

router.get('/', getBombList);
router.get('/file/:longId', getBombFileByLongId);

router.post('/', createBomb);

export default router;
