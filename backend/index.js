// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const Document = require('./models/Document');
const blockchain = require('./blockchain');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

// Health check
app.get('/', (req, res) => res.send('Backend with local blockchain is running'));

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('🚀 File upload initiated...');
    console.log('Uploaded file:', req.file);

    // Generate SHA256 hash
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    console.log('✅ File hash:', hash);

    // Add to blockchain
    const newBlock = blockchain.addBlock({
      username: req.body.username || "Anonymous",
      filename: req.file.originalname,
      hash
    });

    console.log('✅ Block added:', newBlock);

    // Save to MongoDB
    const doc = await Document.create({
      username: req.body.username || "Anonymous",
      filename: req.file.originalname,
      hash,
      blockchain_tx: newBlock.hash,
      signed_by: "local_blockchain",
      ai_summary: 'AI analysis pending...'
    });

    res.json({
      success: true,
      message: 'Document stored in local blockchain & database.',
      block: newBlock,
      doc
    });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// Route to view the entire blockchain
app.get('/chain', (req, res) => {
  res.json({ chain: blockchain.getChain() });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
});