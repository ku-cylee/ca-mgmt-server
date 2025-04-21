import { Router } from 'express';
import {
    getBombList,
    createBomb,
    getBombFileByLongId,
    getBombFileById,
} from './ctrl';

const router = Router();

router.get('/', getBombList);
router.get('/:bombId', getBombFileById);
router.get('/file/:longId', getBombFileByLongId);

router.post('/', createBomb);

export default router;
