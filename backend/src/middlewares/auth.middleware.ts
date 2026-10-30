import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cbt_super_secret_key_2026';

// Interface untuk memperluas tipe Request Express agar bisa menyimpan data user
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

// Middleware 1: Verifikasi Token JWT
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (!token) {
        res.status(401).json({ error: 'Akses ditolak, token tidak ditemukan!' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa!' });
    }
};

// Middleware 2: Verifikasi Role (Contoh: Hanya ADMIN yang boleh akses)
export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: 'Akses ditolak! Anda tidak memiliki hak akses ke resource ini.' });
            return;
        }
        next();
    };
};