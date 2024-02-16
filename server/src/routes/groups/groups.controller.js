//@ts-check
const { fetchUserGroups, fetchUserManagementGroups } = require("../../models/groups.model");

const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});


async function httpGetUserGroups(req, res) {
  logger.info("httpGetUserGroups | GET");
  try {
    const groups = await fetchUserGroups(req?.user?.uid);
    res.status(200).json(groups);
  } catch (error) {
    logger.error("httpGetUserGroups  | ERROR", error);
    res.status(400);
  }
}

async function httpGetUserManagementGroups(req, res) {
  logger.info("httpGetUserGroups | GET");
  try {
    const groups = await fetchUserManagementGroups(req?.user?.uid);
    res.status(200).json(groups);
  } catch (error) {
    logger.error("httpGetUserGroups  | ERROR", error);
    res.status(400);
  }
}



module.exports = {
  httpGetUserGroups,
  httpGetUserManagementGroups
};
