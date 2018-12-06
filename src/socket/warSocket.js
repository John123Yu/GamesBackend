var { War } = require("./deck/war");

let warGames = {};
var warSocket = (socket, io, room, errorEmit) => {
  socket.on("joinWar", ({ name }) => {
    if (!warGames[room]) {
      warGames[room] = new War();
    }
    WarGames[room].addPlayer(name);
  });

  socket.on("startWar", () => {
    WarGames[room].dealCards();
  });

  socket.on("hitWar", ({ username }) => {
    warGames[room][shownCards] = {};
    warGames[room][shownCards][username] = [];
    warGames[room][shownCards][username].push(
      warGames[room].players.filter(player.name === username)[0].hit()
    );
    io.in(room).emit("shownCards", {
      players
    });
  });

  socket.on("disconnect", () => {});
};

module.exports = { WarSocket };
