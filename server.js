import User from "./models/User.js";

// --- SMOKE TEST SERVER (keep it simple) ---
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const app = express();

// show any hidden crash reason
process.on('unhandledRejection', err => console.error('UNHANDLED REJECTION:', err));
process.on('uncaughtException', err => console.error('UNCAUGHT EXCEPTION:', err));

app.get('/', (_req, res) => res.json({ ok: true, stage: 'smoke' }));

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('MONGO_URI missing');
} else {
  mongoose.connect(MONGO)
    .then(() => console.log('Mongo connected (smoke)'))
    .catch(e => console.error('Mongo error (smoke):', e.message));
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('SMOKE server running on', PORT));
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
