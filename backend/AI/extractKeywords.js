// ai/extractKeywords.js
const fs = require('fs');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function readPdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

async function extractKeywordsFromPdf(pdfPath) {
  try {
    const text = await readPdf(pdfPath);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Extract important keywords from the following document content:

${text.slice(0, 3000)}

Return only a comma-separated list of keywords.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const keywords = response.text().trim();

    return keywords;
  } catch (err) {
    console.error('❌ AI Extraction failed:', err);
    return 'AI keyword extraction failed';
  }
}

module.exports = extractKeywordsFromPdf;
