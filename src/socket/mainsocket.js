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
  messages: /item\/(\d+)\/messages/
};

const ee = new EventEmitter();
const namespacesCreated = {};

var socketConnector = server => {
  const io = require("socket.io")(server, { origins: "*:*" });
  // io.use((socket, next) => {
  //   sessionMiddleware(socket.request, {}, next);
  // });

  io.on("connection", socket => {
    const { ns } = url.parse(socket.handshake.url, true).query;
    let matched = false;

    if (!ns) {
      // if there is not a ns in query disconnect the socket
      socket.disconnect();
      return { err: "ns not provided" };
    }

    Object.keys(routes).forEach(name => {
      const matches = ns.match(routes[name]);

      console.log(ns);
      console.log(name);
      console.log(matches);

      if (matches) {
        matched = true;
        console.log("here");
        if (!namespacesCreated[ns]) {
          console.log("HELLO");
          // check if the namespace was already created
          namespacesCreated[ns] = true;
          console.log(io.of(ns).on);
          let namespace = io.of(ns);
          namespace.on("connection", nsp => {
            console.log("Jojo is a terrible person");
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

  ee.on("dynamic.group.messages", (socket, categoryId, itemId) => {
    console.log("HERE");
    setupSocket(socket, categoryId, itemId, errorEmit);
    messagesSocket(socket, categoryId, itemId, errorEmit);
    blackJackSocket(socket, categoryId, itemId, errorEmit);
  });
};

module.exports = { socketConnector };
