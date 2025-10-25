import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import path from 'path';

// safe bcrypt import for Node 22
import bcryptNS from 'bcrypt';
const bcrypt = bcryptNS.default || bcryptNS;

// models & routes
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';

const app = express();
import cors from 'cors';


// middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 120 }));

// static uploads
app.use('/uploads', express.static('uploads'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// health
app.get('/', (_req, res) => res.json({ ok: true }));

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo error:', err));

// auto-create admin on first boot
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
