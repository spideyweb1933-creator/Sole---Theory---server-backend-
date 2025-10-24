import express from 'express';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public: list products
router.get('/', async (_req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
});

// Admin: create product
router.post('/', auth('admin'), async (req, res) => {
  const { name, price, imageUrl } = req.body;
  const p = await Product.create({ name, price, imageUrl });
  res.json(p);
});

// Admin: update product
router.put('/:id', auth('admin'), async (req, res) => {
  const { name, price, imageUrl } = req.body;
  const p = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, imageUrl, updatedAt: new Date() },
    { new: true }
  );
  res.json(p);
});

// Admin: delete product
router.delete('/:id', auth('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;

