import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import noteRoutes from './routes/notes.js';
import settingsRoutes from './routes/settings.js';
import adminRoutes from './routes/admin.js';
import migrationRoutes from './routes/migration.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // For development, allow everything
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (req.url !== '/api/test') {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url} [${res.statusCode}] - ${duration}ms`);
        }
    });
    next();
});

// Database connection
connectDB();

// --- Socket.io for Real-Time Instant Data ---
io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    socket.on('join_dashboard', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`👤 User joined dashboard room: user_${userId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
    });
});

// Attach io to global req for use in controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

const PORT = parseInt(process.env.PORT) || 5000;

// --- Routes ---
app.get('/', (req, res) => res.send('ProgressHub Socket.io Server API is running'));
app.get('/api/test', (req, res) => res.json({ message: 'API working' }));

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/migrate', migrationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// --- Start Server via httpServer ---
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
