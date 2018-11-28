// Expires sets ---> https://quickleft.com/blog/how-to-create-and-expire-list-items-in-redis/

const { client } = require("../../redis/mainredis");

if (!client.exists("allGames")) {
  client
    .zaddAsync(["allGames", new Date().getTime(), "demo"])
    .then((err, reply) => {
      if (err) console.log(err);
      else console.log(reply);
    });
}
async function create(req, res, next) {
  let gamename = `${req.body.gamename}`;
  let exists = await client.existsAsync(gamename);
  if (exists !== "0") {
    console.log("IN");
    let setGame = client.setAsync(gamename, "1", "EX", 86400);
    let addGametoSet = client.zaddAsync([
      "allGames",
      new Date().getTime(),
      gamename
    ]);
    Promise.all([setGame, addGametoSet])
      .then(values => {
        console.log("values", values);
        res.json(values);
      })
      .catch(error => {
        console.log("error!", error);
        res.json(error);
      });
  } else {
    res.json({ message: "game already exists" });
  }
}

function join(req, res, next) {
  if (client.exists(req.body.gamename)) {
    client.incrAsync(req.body.gamename).then(value => {
      res.json({ message: `joined ${req.body.gamename} - ${value}` });
    });
  }
}

function leave(req, res, next) {
  if (client.exists(req.body.gamename)) {
    client.decr(req.body.gamename);
  } else {
    res.json({ message: `${req.body.gamename} does not exist` });
  }
  if (client.get(req.body.gamename) < 1) {
    client.zrem("allGames", req.body.gamename);
  }
  res.json({ message: `left ${req.body.gamename}` });
}

function list(req, res, next) {
  let allGames = client
    .zrangeAsync("allGames", 0, -1)
    .then(games => {
      console.log("HERE, ", games);
      res.json(games);
    })
    .catch(err => {
      res.json(err);
    });
}

module.exports = { create, join, list, leave };

function makeid(range) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < range; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
