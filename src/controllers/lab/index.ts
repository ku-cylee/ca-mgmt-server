import { Router } from 'express';
import { createLab, deleteLab, getLab, getLabList, updateLab } from './ctrl';

const router = Router();

router.get('/', getLabList);
router.get('/:labName', getLab);

router.post('/', createLab);

router.put('/:labName', updateLab);

router.delete('/:labName', deleteLab);

export default router;
