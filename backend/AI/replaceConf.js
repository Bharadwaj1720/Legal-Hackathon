// Simulated incoming JSON string (from API, file, etc.)
const jsonConfWords = '["Apple", "secret", "proprietary"]';
const confWords = JSON.parse(jsonConfWords);  // ✅ now it's an array

const text = "This contract contains proprietary and secret information from Apple.";

/**
 * Replaces confidential words with asterisks and logs redacted words.
 *
 * @param {string[]} extracted - Array of confidential words.
 * @param {string} text - Input text to censor.
 * @returns {{ cleanText: string, redactedWords: string[] }}
 */
function replaceConf(extracted, text) {
    let cleanText = text;
    let redactedWords = [];

    for (let word of extracted) {
        const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'); // Match whole words
        if (pattern.test(cleanText)) {
            redactedWords.push(word);
            cleanText = cleanText.replace(pattern, match => '*'.repeat(match.length)); // Replace with asterisks
        }
    }

    return { cleanText, redactedWords };
}

// Example usage: Replacing confidential words in the provided text
const result = replaceConf(confWords, text);

console.log("🔒 Censored Text:", result.cleanText);
console.log("📌 Redacted Words:", result.redactedWords);

