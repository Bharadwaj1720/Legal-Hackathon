const { MongoClient } = require("mongodb");

async function checkConflicts(inputKeywords, mongoUri, dbName, collectionName) {
  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Query to find documents that have at least one overlapping keyword
    const query = {
      conflicts: { $in: inputKeywords }
    };

    const matchedDocuments = await collection.find(query).toArray();

    // Extract and deduplicate matching keywords
    const matchedKeywords = new Set();

    matchedDocuments.forEach(doc => {
      if (Array.isArray(doc.conflicts)) {
        doc.conflicts.forEach(keyword => {
          if (inputKeywords.includes(keyword)) {
            matchedKeywords.add(keyword);
          }
        });
      }
    });

    return Array.from(matchedKeywords);
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    return [];
  } finally {
    await client.close();
  }
}

module.exports = checkConflicts;
