const express = require("express");
const app = express();
const port = process.env.port || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
// console.log();
// middlewere
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rom6hen.mongodb.net/?appName=Cluster0`;

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
    const connectionsColl = db.collection("connections");

    // mongodb server get Data
    app.get("/partners", async (req, res) => {
      const cursor = partnersColl.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get top 3 rated partner data
    app.get("/partners/top-rated", async (req, res) => {
      const cursor = partnersColl.find().sort({ rating: -1 }).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get partners by query
    app.get("/partners/query", async (req, res) => {
      const { sort, search } = req.query;
      let query = {};
      if (sort) {
        query.experienceLevel = { $regex: sort, $options: "i" };
      }
      if (search) {
        query.subject = { $regex: search, $options: "i" };
      }
      const result = await partnersColl.find(query).toArray();
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
      const data = req.body;
      const result = await partnersColl.insertOne(data);
      res.send(result);
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

    // New Collection for all connections
    app.get("/connections", async (req, res) => {
      const email = req.query.email;
      const filter = {
        email: email,
      };
      const cursor = connectionsColl.find(filter);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get connection by ID
    app.get("/connections/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await connectionsColl.findOne(filter);
      res.send(result);
    });
    // connections add to the db
    app.post("/connections", async (req, res) => {
      const data = req.body;
      const result = await connectionsColl.insertOne(data);
      res.send(result);
    });

    // connection delete
    app.delete("/connections/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: new ObjectId(id),
      };
      const result = await connectionsColl.deleteOne(filter);
      res.send(result);
    });

    // update connection's details
    app.patch("/connections/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const data = req.body;
      const update = {
        $set: {
          partnerInfo: {
            name: data.name,
            profileimage: data.profileimage,
            subject: data.subject,
            studyMode: data.studyMode,
          },
        },
      };
      const result = await connectionsColl.updateOne(filter, update);
      res.send(result);
    });

    // delete data
    app.delete("/partners", async (req, res) => {
      const query = { profileimage: { $regex: "ibb" } };
      const result = await partnersColl.deleteMany(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
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
