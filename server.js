
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Mongo connected'));

// ADD this block right below ↑
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

- import rateLimit from 'express-rate-limit';
+ import { rateLimit } from 'express-rate-limit';
