const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const api = require("./src/routes/api");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/", api);
app.use(express.urlencoded({ extended: false }));
app.use("/image", express.static("image"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
