const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const io = require("socket.io");
const fs = require("fs");
const { Socket } = require("./src/controllers/messageController");
const SlackErrorNotificationBot = require("./src/functions/slack-bot");

const db = require("./utils/db");
const config = require("./config/index.js");

const route = require("./src/routes");
const logger = require("./config/logger");

if (!fs.existsSync("./public/")) {
  fs.mkdir("./public/", err => {
    if (err) {
      return console.log("failed to write directory", err);
    }
  });
}

if (!fs.existsSync("./public/upload/")) {
  fs.mkdir("./public/upload/", err => {
    if (err) {
      return console.log("failed to write directory", err);
    }
  });
}

if (!fs.existsSync("./public/upload/products/")) {
  fs.mkdir("./public/upload/products/", err => {
    if (err) {
      return console.log("failed to write directory", err);
    }
  });
}

// Models
const Models = require("./src/models");

const app = express();

// Parse the payload and add to request.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// Setup morgan dev
app.use(morgan("dev"));

// Attach all the database models to here
app.use((req, res, next) => {
  req.Models = Models;
  req.log = logger.log;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-access-token");
  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

// All route should be added to the index.js file inside the route folder
app.use("/", cors(), route);

// Handle the error
app.use((err, req, res, next) => {
  logger.error(err);
  if (process.env.NOTIFY_SLACK === "true") {
    new SlackErrorNotificationBot({
      username: "BackEndBot",
      type: "error",
      webHookUrl: process.env.SLACK_WEB_HOOK_URL
    }).sendMessage(err);
  }
});

db.connect(config.dbUrl);

const server = app.listen(config.port);
//  Start socketIo
new Socket(io(server)).startSocket();

logger.log(`\nListening @ port http://localhost:${config.port}`);
