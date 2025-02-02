import { Router } from 'express';
import { createDefuse, getDefuseList } from './ctrl';

const router = Router();

router.get('/', getDefuseList);

router.post('/', createDefuse);

export default router;
