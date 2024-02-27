const express = require("express");
const {
  httpGetUserGroups, httpGetUserManagementGroups, httpGenerateInvitation, httpJoinGroup, httpCreateGroup, httpDeleteGroup
} = require("./groups.controller");

const groupsRouter = express.Router();

groupsRouter.get("/", httpGetUserGroups);
groupsRouter.get("/management", httpGetUserManagementGroups);
groupsRouter.post("/generate-invitation", httpGenerateInvitation);
groupsRouter.post("/join", httpJoinGroup);
groupsRouter.put("/create", httpCreateGroup);
groupsRouter.post("/delete-group", httpDeleteGroup)

module.exports = groupsRouter;
