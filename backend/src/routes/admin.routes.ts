import { Router } from 'express';
import {
    getAllTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    importTeachersExcel,
    getAllSubjectsForSelection
} from '../controllers/admin.controller';
import { verifyToken, requireRole } from '../middlewares/auth.middleware';
import multer from 'multer';

// Konfigurasi Multer untuk penyimpanan sementara file Excel di memory
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Rute Kelola Guru
router.get('/teachers', verifyToken, requireRole(['ADMIN']), getAllTeachers);
router.post('/teachers', verifyToken, requireRole(['ADMIN']), createTeacher);
router.put('/teachers/:id', verifyToken, requireRole(['ADMIN']), updateTeacher);
router.delete('/teachers/:id', verifyToken, requireRole(['ADMIN']), deleteTeacher);

// Rute Import Excel Guru
router.post('/teachers/import', verifyToken, requireRole(['ADMIN']), upload.single('file_excel'), importTeachersExcel);

// Rute Opsional untuk Pilihan Mapel
router.get('/subjects-selection', verifyToken, requireRole(['ADMIN']), getAllSubjectsForSelection);

export default router;