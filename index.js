const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const scrapeVideoUrl = require("./handlers/scrapeVideoUrl");

app.use(express.json());

app.post("/api/get-url", scrapeVideoUrl);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something went wrong", message: err.message });
});

module.exports.handler = serverless(app);
