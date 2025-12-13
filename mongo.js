const { MongoClient, ServerApiVersion } = require("mongodb");

let client;
let clientPromise;

const uri = process.env.MONGODB_URI;

if (!clientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  clientPromise = client.connect();
}

module.exports = clientPromise;