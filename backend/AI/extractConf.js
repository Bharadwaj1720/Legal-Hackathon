// extract_relations_gemini.js

async function extractConfidentialGemini(text, relationConfig, geminiApi, extracted) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    console.log(`Extracted ${sentences.length} sentences. Processing in chunks...\n`);
  
    const chunkSize = 5;
    const chunks = [];
    const chunkSentenceMap = [];
  
    for (let i = 0; i < sentences.length; i += chunkSize) {
      const chunkSentences = sentences.slice(i, i + chunkSize);
      chunks.push(chunkSentences.join(" "));
      chunkSentenceMap.push([...Array(chunkSentences.length).keys()].map(j => j + i));
    }
  
    let curr = 0;
    let tot = 0;
  
    const relationName = relationConfig.name;
    const relationDescription = {
      "Names": "names of individuals represented by the firm",
      "Dates": "important dates for the client",
      "Locations": "locations that relate to the client or their activities",
      "Other": "other confidential information"
    }[relationName] || relationName;
  
    const examplesMap = {
      1: [["Jeff Bezos", "Princeton University"], ["Bill Gates", "Harvard University"]],
      2: [["Alec Radford", "OpenAI"], ["Sundar Pichai", "Google"]],
      3: [["Mariah Carey", "New York City"], ["Elon Musk", "Texas"]],
      4: [["Microsoft", "Satya Nadella"], ["Apple", "Tim Cook"]]
    };
    const examples = examplesMap[relationConfig.id];
  
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
  
      const prompt = `
  You are an expert lawyer who understands what information must be kept confidential in attorney work product. Extract all "${relationName}" confidential information from the text below.
  
  A "${relationName}" relation identifies ${relationDescription}.
  
  FORMATTING INSTRUCTIONS:
  1. Return ONLY a valid JSON array containing all relations you find
  2. Each confidential information should be an array with 2 elements: [conf_info, info_type]
  3. For example: ["Jeff Bezos", "Names"]
  4. If you find no relations, return an empty array: []
  
  TEXT TO ANALYZE:
  "${chunk}"
  
  EXTRACTED RELATIONS (JSON array format):
  `;
  
      try {
        await new Promise(res => setTimeout(res, 5000)); // Sleep for 5 seconds
        const response = await geminiApi.generateContent(prompt);
        const responseText = response.text.trim();
  
        let match = responseText.match(/\[.*\]/s);
        if (match) {
          const relations = JSON.parse(match[0]);
          if (Array.isArray(relations)) {
            for (const relation of relations) {
              if (Array.isArray(relation) && relation.length === 3) {
                const [subject, relType, obj] = relation;
                if (relType === relationName) {
                  tot++;
                  let subjectIdx = null;
                  let objectIdx = null;
                  let sourceSentence = null;
  
                  for (const idx of chunkSentenceMap[i]) {
                    if (sentences[idx].toLowerCase().includes(subject.toLowerCase())) {
                      subjectIdx = idx;
                    }
                    if (sentences[idx].toLowerCase().includes(obj.toLowerCase())) {
                      objectIdx = idx;
                    }
                    if (subjectIdx !== null && objectIdx !== null && sentences[idx].toLowerCase().includes(subject.toLowerCase()) && sentences[idx].toLowerCase().includes(obj.toLowerCase())) {
                      sourceSentence = sentences[idx];
                      break;
                    }
                  }
  
                  if (!sourceSentence && subjectIdx !== null && objectIdx !== null) {
                    const combined = sentences.slice(Math.min(subjectIdx, objectIdx), Math.max(subjectIdx, objectIdx) + 1).join(" ");
                    sourceSentence = combined;
                  } else if (!sourceSentence) {
                    sourceSentence = chunk;
                  }
  
                  console.log("=== Extracted Relation ===");
                  console.log(`Sentence: ${sourceSentence}`);
                  console.log(`Subject: ${subject} ; Object: ${obj}`);
  
                  const relationKey = `${subject}||${obj}||1.0`;
                  if (!extracted.some(item => `${item[0]}||${item[1]}||${item[2]}` === relationKey)) {
                    console.log("Adding to set of extracted relations");
                    curr++;
                    extracted.push([subject, obj, 1.0]);
                  } else {
                    console.log("Duplicate relation. Ignoring this.");
                  }
                  console.log("==========");
                }
              }
            }
          }
        }
      } catch (e) {
        console.error(`Error with Gemini API for chunk ${i + 1}: ${e}`);
      }
  
      console.log(`Processed ${Math.min((i + 1) * chunkSize, sentences.length)}/${sentences.length} sentences`);
    }
  
    console.log(`\n\tExtracted annotations for ${tot} out of total ${sentences.length} sentences`);
    console.log(`Relations extracted from this website : ${curr} (Overall: ${tot})`);
  
    return extracted;
  }
  
  module.exports = extractConfidentialGemini;
  