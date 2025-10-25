import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import path from 'path';

import User from './models/User.js';
import bcryptNS from 'bcrypt';
const bcrypt = bcryptNS.default || bcryptNS;

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Mongo connected'));

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
