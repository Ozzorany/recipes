const express = require("express");
const {
  httpGetUserGroups
} = require("./groups.controller");

const groupsRouter = express.Router();

groupsRouter.get("/", httpGetUserGroups);

module.exports = groupsRouter;
