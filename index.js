const express = require('express');
const app = express();
const port = process.env.port || 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json())

app.get('/', (req, res)=>{
  res.send("server started")
})

app.listen(port, (req, res)=>{
  console.log("server side started", port);
})