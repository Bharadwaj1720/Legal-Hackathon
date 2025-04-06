const { MongoClient } = require("mongodb");

async function checkConflicts(inputKeywords, mongoUri, dbName, collectionName) {
  const client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all documents that share at least one keyword
    const query = {
      keywords: { $in: inputKeywords },
    };

    const docs = await collection.find(query).toArray();

    // Filter to only include documents with >= 5 overlapping keywords
    const matchedDocuments = docs.filter((doc) => {
      const commonKeywords = doc.keywords?.filter((k) => inputKeywords.includes(k)) || [];
      return commonKeywords.length >= 5;
    });

    return matchedDocuments;
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    return [];
  } finally {
    await client.close();
  }
}

module.exports = checkConflicts;
