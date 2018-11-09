const mongoose = require("mongoose");
const util = require("util");

// config should be imported before importing any other file
const config = require("./config/config");
const app = require("./config/express");

const debug = require("debug")("express-mongoose-es6-rest-api:index");

// make bluebird default Promise
Promise = require("bluebird"); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(
  mongoUri,
  { server: { socketOptions: { keepAlive: 1 } } }
);
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  var server = app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
  const io = require("socket.io")(server, { origins: "*:*" });

  io.on("connection", socket => {
    socket.on("message", ({ message, nickname }) => {
      console.log("NICKNAME: ", nickname);
      io.emit("messages", {
        message,
        nickname,
        timestamp: Date.now()
      });
    });
  });
}

module.exports = app;
