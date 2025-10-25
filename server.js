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
