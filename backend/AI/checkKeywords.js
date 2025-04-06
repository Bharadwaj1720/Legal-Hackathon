// checkKeywords.js
const { MongoClient } = require("mongodb");

async function checkKeywords(inputKeywords, mongoUri, dbName, collectionName) {
  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Find documents where at least one keyword matches
    const query = {
      keywords: { $in: inputKeywords }
    };

    const matchedDocuments = await collection.find(query).toArray();

    return matchedDocuments;
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    return [];
  } finally {
    await client.close();
  }
}

module.exports = checkKeywords;