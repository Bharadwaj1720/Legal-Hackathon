const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  username: String,
  filename: String,
  hash: String,
  blockchain_tx: String,
  signed_by: String,
  ai_summary: String,
  form_type: String,
  sic: String,
  fye: String,
  filing_date: String,
  filing_date_period: String,
  filing_date_change: String,
  keywords: [String],
  conflicts: [String],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', DocumentSchema);
