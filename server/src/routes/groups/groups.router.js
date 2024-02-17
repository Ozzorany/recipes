const express = require("express");
const {
  httpGetUserGroups, httpGetUserManagementGroups, httpGenerateInvitation, httpJoinGroup
} = require("./groups.controller");

const groupsRouter = express.Router();

groupsRouter.get("/", httpGetUserGroups);
groupsRouter.get("/management", httpGetUserManagementGroups);
groupsRouter.post("/generate-invitation", httpGenerateInvitation);
groupsRouter.post("/join", httpJoinGroup);

module.exports = groupsRouter;
