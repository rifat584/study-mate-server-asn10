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
    const db = client.db("studymate");
    const partnersColl = db.collection("partners");

    // mongodb server get Data
    app.get("/partners", async (req, res) => {
      const cursor = partnersColl.find();
      const result = await cursor.toArray();
      res.send(result);
      console.log(result);
    });

    // send partner data to mongodb
    app.post("/partners", async (req, res) => {
      const data = req.body; //replace
      const result = await partnersColl.insertMany(data);
      res.send(result);
      console.log(result);
    });

    // delete data
    app.delete("/partners", async (req, res) => {
      const query = { profileimage: { $regex: "ibb" } };
      const result = await partnersColl.deleteMany(query);
      res.send(result);
      console.log(result);
    });

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
