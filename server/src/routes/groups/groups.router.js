const express = require("express");
const {
  httpGetUserGroups, httpGetUserManagementGroups
} = require("./groups.controller");

const groupsRouter = express.Router();

groupsRouter.get("/", httpGetUserGroups);
groupsRouter.get("/management", httpGetUserManagementGroups);

module.exports = groupsRouter;
