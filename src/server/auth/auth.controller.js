const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const config = require("../../config/config");

// sample user, used for authentication
const user = {
  username: "react",
  password: "express"
};

/**np
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  if (
    req.body.username === user.username &&
    req.body.password === user.password
  ) {
    const token = jwt.sign(
      {
        username: user.username
      },
      config.jwtSecret
    );
    return res.json({
      token,
      username: user.username
    });
  }

  const err = new APIError(
    "Authentication error",
    httpStatus.UNAUTHORIZED,
    true
  );
  return next(err);
}

/**
 * Returns jwt token and user if valid token is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function socialLogin(req, res, next) {
  if (!req.user) {
    return res.status(401).send("User Not Authenticated");
  }
  req.auth = {
    id: req.user.id
  };
  req.session.token = req.auth;
  req.session.save(err => {
    console.log("save err", err);
    if (!err) console.log(req.session.id);
  });
  next();
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login, getRandomNumber, socialLogin };
