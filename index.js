const express = require("express");
const app = express();
const port = process.env.port || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
// middlewere
app.use(cors());
app.use(express.json());

// mongodb
const uri =
  "mongodb+srv://studymate_db:CbOeiVLs3g48ErJG@cluster0.rom6hen.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("studymate")
    const partnerColl = db.collection("partners")


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server started");
});

app.listen(port, (req, res) => {
  console.log("server side started", port);
});
