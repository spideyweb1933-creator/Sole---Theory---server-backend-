// --- SOLE THEORY: stable boot server.js ---
// show any hidden crash reasons
process.on('unhandledRejection', err => console.error('UNHANDLED REJECTION:', err?.stack || err));
process.on('uncaughtException',  err => console.error('UNCAUGHT EXCEPTION:',  err?.stack || err));

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const app = express();
console.log('Booting Sole Theory server…');

// ---- CORS: allow your domains & vercel apps ----
const allowedOrigins = [
  'https://soletheory.fit',
  'https://www.soletheory.fit',
  'https://sole-theory-admin-ui.vercel.app',
  'https://sole-theory-store.vercel.app'
];

const vercelRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                       // same-origin, curl, mobile apps
    if (allowedOrigins.includes(origin)) return cb(null, true);
    if (vercelRegex.test(origin)) return cb(null, true);       // any vercel preview
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors());

// ---- Security & body parsing ----
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '5mb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

// ---- Health route ----
app.get('/', (_req, res) => res.json({ ok: true, service: 'sole-theory-backend' }));

// ---- (optional) static uploads folder ----
app.use('/uploads', express.static('uploads'));

// ---------- DB connect ----------
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is missing in env!');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.error('Mongo error:', err.message));
}

// ---------- START ----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
