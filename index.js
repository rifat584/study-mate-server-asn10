const express = require("express");
const app = express();
const port = process.env.port || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // get top 3 rated partner data
    app.get("/partners/top-rated", async (req, res) => {
      const cursor = partnersColl.find().sort({ rating: -1 }).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get partners by subject
    app.get("/partners/:subject", async (req, res) => {
      const subject = req.params.subject;

      const query = { subject: { $regex: subject, $options: "i" } };

      const cursor = partnersColl.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });
    // get partner's details by id
    app.get("/partner-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await partnersColl.findOne(query);
      res.send(result);
    });

    // send partner data to mongodb
    app.post("/partners", async (req, res) => {
      const data = req.body; //replace
      console.log(req.body);
      const result = await partnersColl.insertOne(data);
      res.send(result);
      console.log(result);
    });

    // update partner count
    app.patch("/partner/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatePartner = {
        $inc: {
          patnerCount: 1,
        },
      };
      const options = {};
      const result = await partnersColl.updateOne(
        filter,
        updatePartner,
        options
      );
      res.send(result);
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
