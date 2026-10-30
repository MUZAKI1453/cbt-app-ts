import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// Halaman login bersifat publik untuk semua role (Admin, Guru, Siswa)
router.post('/login', login);

export default router;