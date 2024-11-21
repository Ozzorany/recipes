const express = require("express");
const {
  healthCheckController
} = require("./health.controller");

const healthRouter = express.Router();

healthRouter.get("/", healthCheckController);

module.exports = healthRouter;
