import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'; // ✅ named export (v7)
import path from 'path';

// routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';

const app = express();

// security + basics
app.use(helmet());
app.use(
  cors({
    origin: true, // later restrict to your admin UI domain
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

// connect DB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Mongo connected'));

// ✅ AUTO-CREATE ADMIN once DB is open (mobile friendly bootstrap)
import User from './models/User.js';
import bcrypt from 'bcrypt';

mongoose.connection.once('open', async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const username = process.env.INIT_ADMIN_USER || 'admin';
      const pass = process.env.INIT_ADMIN_PASS || 'ChangeThis123!';
      const hash = await bcrypt.hash(pass, 10);
      await User.create({ username, passwordHash: hash, role: 'admin' });
      console.log('Admin user created automatically:', username);
    }
  } catch (e) {
    console.error('Auto-admin create failed:', e.message);
  }
});

// serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// health check
app.get('/', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on', port));
