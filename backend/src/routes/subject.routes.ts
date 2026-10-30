import { Router } from 'express';
import {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject
} from '../controllers/subject.controller';
import { verifyToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/subjects', verifyToken, requireRole(['ADMIN']), getAllSubjects);
router.post('/subjects', verifyToken, requireRole(['ADMIN']), createSubject);
router.put('/subjects/:id', verifyToken, requireRole(['ADMIN']), updateSubject);
router.delete('/subjects/:id', verifyToken, requireRole(['ADMIN']), deleteSubject);

export default router;