// ai/extractKeywords.js
const fs = require('fs');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function readPdf(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (err) {
    console.error("Failed to parse PDF:", err.message);
    throw new Error("Invalid PDF structure");
  }
}

async function extractKeywordsFromPdf(pdfPath) {
  try {
    const text = await readPdf(pdfPath);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

    const prompt = `Extract important keywords from the following text:

${text.slice(0, 3000)}

Return only a comma-separated list of keywords, no explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const keywords = response.text().trim();

    return keywords;
  } catch (err) {
    console.error("❌ AI Extraction failed:", err);
    return "";
  }
}

module.exports = extractKeywordsFromPdf;