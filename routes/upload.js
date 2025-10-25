import express from 'express';
import multerNS from 'multer';
import path from 'path';
import fs from 'fs';
import auth from '../middleware/auth.js';

const multer = multerNS.default || multerNS;
const router = express.Router();

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
    cb(null, `${Date.now()}_${name}${ext}`);
  }
});
const upload = multer({ storage });

router.post('/', auth('admin'), upload.single('image'), (req, res) => {
  const url = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
