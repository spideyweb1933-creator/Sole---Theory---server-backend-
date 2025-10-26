// server.js (ESM)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// bcrypt safe import
import bcryptNS from 'bcrypt';
const bcrypt = bcryptNS.default || bcryptNS;

// models & routes
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';

const app = express();

/* CORS (TEMP: allow everything to unblock; we will lock later) */
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());

/* security & parsers */
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '5mb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

/* static uploads */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* routes */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

/* health */
app.get('/', (_req, res) => res.json({ ok: true }));

/* DB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo error:', err));

/* auto-create admin */
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

/* start */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));

app.use(
  cors({
    origin(origin, cb) {
      // allow same-origin / curl / server-to-server (no Origin header)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// speed up preflights
app.options('*', cors());

/* ---------- security & parsers ---------- */
app.use(helmet({ crossOriginResourcePolicy: false })); // allow images from /uploads
app.use(express.json({ limit: '5mb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

/* ---------- static uploads ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------- routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// health check
app.get('/', (_req, res) => res.json({ ok: true }));

/* ---------- DB connect ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo error:', err));

/* ---------- auto-create admin (first boot) ---------- */
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

/* ---------- start ---------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
  
