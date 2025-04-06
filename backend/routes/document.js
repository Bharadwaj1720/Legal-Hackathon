// routes/document.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const Document = require('../models/Document');
const blockchain = require('../blockchain');
const authenticate = require('../middleware/authenticate');
const extractKeywordsFromPdf = require('../AI/extractKeywords');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /documents - upload document
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { form_type, name, sic, fye, filing_date, filing_date_period, filing_date_change } = req.body;
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const newBlock = blockchain.addBlock({
      username: req.user.username,
      filename: req.file.originalname,
      hash
    });

    const keywordsString = await extractKeywordsFromPdf(req.file.path);
    const keywords = keywordsString.split(',').map(k => k.trim());
    print(keywords)

    const doc = await Document.create({
      username: req.user.username,
      filename: req.file.originalname,
      hash,
      blockchain_tx: newBlock.hash,
      signed_by: "local_blockchain",
      ai_summary: 'AI analysis pending...',
      form_type,
      name,
      sic,
      fye,
      filing_date,
      filing_date_period,
      filing_date_change,
      keywords
    });

    res.json({ success: true, block: newBlock, doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// GET /documents - get all documents of a user
router.get('/', authenticate, async (req, res) => {
  try {
    const docs = await Document.find({ username: req.user.username });
    res.json({ success: true, documents: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
