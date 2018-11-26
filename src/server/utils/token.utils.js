const jwt = require("jsonwebtoken");
const config = require("../../config/config");

var createToken = function(auth) {
  return jwt.sign(
    {
      id: auth.id
    },
    config.jwtSecret,
    {
      expiresIn: 60 * 120
    }
  );
};

module.exports = {
  generateToken: function(req, res, next) {
    req.token = createToken(req.auth);
    return next();
  },
  sendToken: function(req, res) {
    res.setHeader("x-auth-token", req.token);
    // req.session.token = req.token;
    // req.session.save(err => {
    //   console.log("save err", err);
    //   if (!err) console.log(req.session.token);
    // });
    return res.status(200).send(JSON.stringify(req.user));
  }
};
