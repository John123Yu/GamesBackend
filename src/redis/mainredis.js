const redis = require("redis");
const config = {
  redis_host: "127.0.0.1",
  redis_port: 16379,
  expire: 600000
};
Promise = require("bluebird");
Promise.promisifyAll(redis);

const client = redis.createClient();

let promiser = (resolve, reject) => {
  return (err, data) => {
    if (err) reject(err);
    resolve(data);
  };
};

let storeUser = (socketID, user) => {
  return new Promise((resolve, reject) => {
    client.setex(socketID, config.expire, user, promiser(resolve, reject));
  });
};

let getUser = socketID => {
  return new Promise((resolve, reject) => {
    client.get(socketID, promiser(resolve, reject));
  });
};

module.exports = { storeUser, getUser, client };
