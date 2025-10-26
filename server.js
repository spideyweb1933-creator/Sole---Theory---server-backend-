require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
console.log('🚀 Booting Sole Theory CJS server...');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true, msg: 'Sole Theory backend running' }));

const uri = process.env.MONGO_URI;
if (uri) {
  mongoose.connect(uri)
    .then(() => console.log('✅ Mongo connected'))
    .catch(e => console.error('Mongo error:', e.message));
} else {
  console.error('❌ Missing MONGO_URI');
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('✅ Server running on', PORT));
