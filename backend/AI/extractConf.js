const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

/**
 * Determines whether a document contains confidential information.
 * @param {string} text - The full text content of the document.
 * @returns {Promise<boolean>} - True if confidential info found, else false.
 */
async function extractConfidentialGemini(text) {
  const prompt = `
You are a legal document reviewer. Your task is to analyze the following text and determine if it contains confidential information.

Confidential information includes:
- Phone number : 6467898170

Return ONLY one word: true or false (all lowercase). Do not include any explanation or punctuation.

TEXT:
"""
${text.slice(0, 12000)}
"""

RESPONSE (only true or false):
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text().trim().toLowerCase();
    console.log("🔎 Gemini response:", answer);

    if (answer === "true") return true
    if (answer === "false") return false;

    // fallback if something unexpected
    console.warn("⚠️ Unexpected Gemini response:", answer);
    return false;
  } catch (err) {
    console.error("❌ Gemini confidential check failed:", err);
    return false;
  }
}

module.exports = extractConfidentialGemini;
