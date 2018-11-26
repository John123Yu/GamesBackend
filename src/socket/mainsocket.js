var { blackJackSocket } = require("./blackjack");
var { messagesSocket } = require("./messages");
var { setupSocket } = require("./setup");
const { sessionMiddleware } = require("../config/express");
const { EventEmitter } = require("events");
const url = require("url");
//set this up with routes
//set up express-socket-session
var errorEmit = socket => {
  return err => {
    console.log(err);
    socket.broadcast.emit("user.events", "Something weng wrong!");
  };
};

const routes = {
  chat: /category\/(\d+)\/item\/(\d+)\/chat/
};

const ee = new EventEmitter();
const namespacesCreated = {};

var socketConnector = server => {
  const io = require("socket.io")(server, { origins: "*:*" });
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.sockets.on("connection", socket => {
    const { ns } = url.parse(socket.handshake.url, true).query;
    let matched = false;

    if (!ns) {
      // if there is not a ns in query disconnect the socket
      socket.disconnect();
      return { err: "ns not provided" };
    }

    Object.keys(routes).forEach(name => {
      const matches = ns.match(routes[name]);

      if (matches) {
        matched = true;
        if (!namespacesCreated[ns]) {
          // check if the namespace was already created
          namespacesCreated[ns] = true;
          io.of(ns).on("connection", nsp => {
            const evt = `dynamic.group.${name}`; // emit an event four our group of namespaces
            ee.emit(evt, nsp, ...matches.slice(1, matches.length));
          });
        }
      }
    });

    if (!matched) {
      // if there was no match disconnect the socket
      socket.disconnect();
    }
  });

  ee.on("dynamic.group.chat", (socket, categoryId, itemId) => {
    // implement your chat logic
  });

  // let namespace = io.of("/api/namespace");
  namespace.on("connection", socket => {
    setupSocket(socket, namespace, errorEmit);
    messagesSocket(socket, namespace, errorEmit);
    blackJackSocket(socket, namespace, errorEmit);
  });
};

module.exports = { socketConnector };
