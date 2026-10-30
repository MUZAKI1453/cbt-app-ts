import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import subjectRoutes from './routes/subject.routes';

// 1. Inisialisasi dotenv paling atas agar environment variables terbaca
dotenv.config();

// 2. Inisialisasi Express & Server HTTP
const app = express();
const server = http.createServer(app);

// 3. Konfigurasi Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 4. Middleware Global
app.use(cors());
app.use(express.json());

// 5. Daftarkan Routes API
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', subjectRoutes);

// Endpoint Tes
app.get('/', (req, res) => {
    res.json({ message: "CBT Backend API is running successfully!" });
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_exam', (data) => {
        console.log(`Student joined exam:`, data);
        socket.join(data.examId);
    });

    socket.on('submit_answer', (data) => {
        console.log(`Answer received:`, data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});