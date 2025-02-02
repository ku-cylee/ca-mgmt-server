import { Router } from 'express';
import { getBombList, createBomb } from './ctrl';

const router = Router();

router.get('/', getBombList);

router.post('/', createBomb);

export default router;
