const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  filename: String,
  hash: String,
  blockchain_tx: String,
  ai_summary: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', DocumentSchema);
