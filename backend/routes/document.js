// routes/document.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const Document = require('../models/Document');
const blockchain = require('../blockchain');
const authenticate = require('../middleware/authenticate');
const extractKeywordsFromPdf = require('../ai/extractKeywords');
const checkConflicts = require('../ai/checkConflicts');
const extractConfidentialGemini = require('../ai/extractConf');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /documents - upload document
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { form_type, name, sic, fye, filing_date, filing_date_period, filing_date_change, force } = req.body;
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    let keywords = [];
    let confidentialFlag = false;

    try {
      const keywordsString = await extractKeywordsFromPdf(req.file.path);
      keywords = keywordsString.split(',').map(k => k.trim()).filter(k => k);
    } catch (e) {
      console.log("AI keyword extraction skipped due to invalid PDF");
    }

    const matchedDocs = await checkConflicts(
      keywords,
      process.env.MONGO_URI,
      'test',
      'documents'
    );

    if (!force && matchedDocs.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Conflict detected. Matching documents exist.",
        conflicts: matchedDocs
      });
    }

    try {
      const data = await pdf(fileBuffer);
      const extracted = await extractConfidentialGemini(data.text);

      if (extracted) {
        confidentialFlag = true;
      }
    } catch (err) {
      console.error("Confidentiality check failed:", err);
    }

    const newBlock = blockchain.addBlock({
      username: req.user.username,
      filename: req.file.originalname,
      hash
    });

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
      keywords,
      confidential: confidentialFlag
    });

    res.json({ success: true, block: newBlock, doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const docs = await Document.find();
    res.json({ success: true, documents: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;