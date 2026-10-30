import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'cbt_super_secret_key_2026';

// Login Controller (Digunakan oleh Admin, Guru, dan Siswa)
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Username dan password wajib diisi!' });
            return;
        }

        // Cari user berdasarkan username (bisa berupa username admin, NIP guru, atau NIS siswa)
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            res.status(401).json({ error: 'Username atau password salah!' });
            return;
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Username atau password salah!' });
            return;
        }

        // Buat JWT Token (berlaku 1 hari)
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login berhasil!',
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
            }
        });
    } catch (error: any) {
        console.error("Error Login:", error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server', details: error.message });
    }
};