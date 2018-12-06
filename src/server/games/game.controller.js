// Expires sets ---> https://quickleft.com/blog/how-to-create-and-expire-list-items-in-redis/
// what if redis client goes down?

const { client: redisClient } = require("../../redis/mainredis");
var Q = require("q");
var moment = require("moment");

var redisHelper = {
  sAdd: function(setName, itemId) {
    return Q.ninvoke(redisClient, "sadd", setName, itemId);
  },

  expire: function(key, timeToLive) {
    return Q.ninvoke(redisClient, "expire", key, timeToLive);
  }
};

function addActivity(itemId, timestamp) {
  var setName = "games" + "-" + _flooredDate(timestamp).unix();
  console.log("set name", setName);
  var ttl = _flooredDate(timestamp)
    .add(24, "hours")
    .unix();

  return redisHelper.sAdd(setName, itemId).then(function() {
    return redisHelper.expire(setName, ttl);
  });
}

function _flooredDate(timestamp) {
  return moment(timestamp)
    .utc()
    .startOf("hour");
}

async function create(req, res, next) {
  let gamename = `${req.body.gametype}-${req.body.gamename}`;
  let exists = await redisClient.existsAsync(gamename);
  if (exists !== "0") {
    let setGame = redisClient.setAsync(gamename, "1", "EX", 86400);
    let addGametoSet = addActivity(gamename, new Date().getTime());
    Promise.all([setGame, addGametoSet])
      .then(values => {
        res.json(values);
      })
      .catch(error => {
        res.json(error);
      });
  } else {
    res.json({ message: "game already exists" });
  }
}

function join(req, res, next) {
  if (redisClient.exists(req.body.gamename)) {
    redisClient.incrAsync(req.body.gamename).then(value => {
      res.json({ message: `joined ${req.body.gamename} - ${value}` });
    });
  }
}

function leave(req, res, next) {
  if (redisClient.exists(req.body.gamename)) {
    redisClient.decr(req.body.gamename);
  } else {
    res.json({ message: `${req.body.gamename} does not exist` });
  }
  res.json({ message: `left ${req.body.gamename}` });
}

async function list(req, res, next) {
  let games_in_all_sets = [];
  for (let i = 0; i < 24; i++) {
    var old_set_times = _flooredDate(new Date().getTime())
      .subtract(i, "hours")
      .unix();
    var setName = "games" + "-" + old_set_times;
    let games = await redisClient.smembersAsync(setName);
    console.log(games);
    games.forEach(element => {
      games_in_all_sets.push(element);
    });
  }
  res.json(games_in_all_sets);
}

async function get(req, res, next) {
  let game = redisClient.getAsync(req.params.gamename);
  res.json(game);
}

module.exports = { create, join, list, leave, get };

function makeid(range) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < range; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
