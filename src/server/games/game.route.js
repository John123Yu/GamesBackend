const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const gameCtrl = require("./game.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
  /** GET /api/games - Get list of games */
  .get(gameCtrl.list)

  /** POST /api/games - Create new game */
  .post(validate(paramValidation.gameActions), gameCtrl.create);

router
  .route("/:userId")
  /** GET /api/games/:gameId - Get game */
  .get(gameCtrl.get);

router
  .route("/games/join")
  /** POST /api/games/join - Join game */
  .post(validate(paramValidation.gameActions), gameCtrl.join);

router
  .route("/games/leave")
  /** POST /api/games/leave - Leave game */
  .post(validate(paramValidation.gameActions), gameCtrl.leave);

module.exports = router;
