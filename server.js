// --- Sole Theory: ultra-stable server (CommonJS) ---
process.on('unhandledRejection', err => console.error('UNHANDLED REJECTION:', err?.stack || err));
process.on('uncaughtException',  err => console.error('UNCAUGHT EXCEPTION:',  err?.stack || err));

require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
console.log('Booting Sole Theory CJS server...');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));

app.get('/', (_req, res) => res.json({ ok: true, service: 'sole-theory-backend', mode: 'cjs' }));

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI is missing');
} else {
  mongoose.connect(uri)
    .then(() => console.log('Mongo connected'))
    .catch(e => console.error('Mongo error:', e.message));
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
