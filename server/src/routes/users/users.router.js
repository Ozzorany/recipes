const express = require("express");
const {
  httpCreateUser, httpGetUserId,
} = require("./users.controller");

const usersRouter = express.Router();

usersRouter.post("/create", httpCreateUser);
usersRouter.get("/:id", httpGetUserId);

module.exports = usersRouter;
