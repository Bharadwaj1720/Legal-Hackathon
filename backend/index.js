// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('./models/Document');
const blockchain = require('./blockchain');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// File upload config
const upload = multer({ dest: 'uploads/' });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

// Routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/document');

app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);

app.get('/', (req, res) => res.send('Backend with local blockchain & auth is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
