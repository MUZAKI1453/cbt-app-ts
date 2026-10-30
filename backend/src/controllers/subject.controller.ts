import { Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// 1. Ambil Semua Data Mapel beserta Guru Pengampunya
export const getAllSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }

        const subjects = await prisma.subject.findMany({
            include: {
                guru: { // Mengambil relasi data guru (pastikan relasi di prisma schema bernama 'guru' atau sesuaikan)
                    select: { id: true, name: true, username: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        res.json({ message: 'Berhasil mengambil data mata pelajaran', data: subjects });
    } catch (error: any) {
        res.status(500).json({ error: 'Kesalahan server', details: error.message });
    }
};

// 2. Tambah Mata Pelajaran Baru
export const createSubject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }

        const { name, guruId } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Nama mata pelajaran wajib diisi!' });
            return;
        }

        const existing = await prisma.subject.findFirst({ where: { name } });
        if (existing) {
            res.status(400).json({ error: 'Mata pelajaran tersebut sudah terdaftar!' });
            return;
        }

        const newSubject = await prisma.subject.create({
            data: {
                name,
                guruId: guruId || null
            }
        });

        res.status(201).json({ message: 'Mata pelajaran berhasil ditambahkan!', data: newSubject });
    } catch (error: any) {
        res.status(500).json({ error: 'Kesalahan server', details: error.message });
    }
};

// 3. Update Mata Pelajaran
export const updateSubject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }

        const { id } = req.params;
        const { name, guruId } = req.body;

        const subject = await prisma.subject.findUnique({ where: { id } });
        if (!subject) {
            res.status(404).json({ error: 'Mata pelajaran tidak ditemukan!' });
            return;
        }

        const updated = await prisma.subject.update({
            where: { id },
            data: {
                name,
                guruId: guruId || null
            }
        });

        res.json({ message: 'Mata pelajaran berhasil diperbarui!', data: updated });
    } catch (error: any) {
        res.status(500).json({ error: 'Kesalahan server', details: error.message });
    }
};

// 4. Hapus Mata Pelajaran
export const deleteSubject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }

        const { id } = req.params;
        await prisma.subject.delete({ where: { id } });

        res.json({ message: 'Mata pelajaran berhasil dihapus!' });
    } catch (error: any) {
        res.status(500).json({ error: 'Kesalahan server', details: error.message });
    }
};