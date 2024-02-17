//@ts-check
const {
  fetchUserGroups,
  fetchUserManagementGroups,
  fetchGroupById,
  addUserToGroup,
  createNewGroup,
} = require("../../models/groups.model");
const jwt = require("jsonwebtoken");

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

async function httpGenerateInvitation(req, res) {
  const userId = req?.user?.uid;
  const { groupId } = req.body;
  const group = await fetchGroupById(groupId);

  if (group?.managerId !== userId) {
    res.status(400);
    return;
  }

  // @ts-ignore
  const { secretKey } = JSON.parse(process.env.JWT_SECRET_KEY);
  const token = jwt.sign({ groupId }, secretKey);

  logger.info("httpGenerateInvitation | GET");
  try {
    res
      .status(200)
      .json(
        encodeURI(`https://recipes-e6692.web.app/groups-management/join?groupName=${group?.name}&token=${token}`)
      );
  } catch (error) {
    logger.error("httpGenerateInvitation  | ERROR", error);
    res.status(400);
  }
}

async function httpJoinGroup(req, res) {
  const userId = req?.user?.uid;

  // @ts-ignore
  const { secretKey } = JSON.parse(process.env.JWT_SECRET_KEY);
  const token = req.body.token;

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      res.status(400).send({ success: false });
    } else {
      const { groupId } = decoded;
      await addUserToGroup(groupId, userId);
      
      res.status(200).send({ success: true });
    }
  });
}

async function httpCreateGroup(req, res) {
  res.status(200).json(await createNewGroup(req.body, req?.user?.uid));
}


module.exports = {
  httpGetUserGroups,
  httpGetUserManagementGroups,
  httpGenerateInvitation,
  httpJoinGroup,
  httpCreateGroup
};
