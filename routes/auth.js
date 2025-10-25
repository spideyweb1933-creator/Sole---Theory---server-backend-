import express from 'express';

import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
});

export default router;




 import bcryptNS from 'bcrypt';
 import jwtNS from 'jsonwebtoken';
 const bcrypt = bcryptNS.default || bcryptNS;
const jwt = jwtNS.default || jwtNS;
