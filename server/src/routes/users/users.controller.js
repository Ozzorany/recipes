//@ts-check
const { createUser, fetchUserById, updateFavoriteRecipes } = require("../../models/users.model");

const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

async function httpCreateUser(req, res) {
  res.status(200).json(await createUser(req.body));
}

async function httpGetUserId(req, res) {
  logger.info("httpGetUserId | GET");
  try {
    const recipe = await fetchUserById(req?.params?.id);
    res.status(200).json(recipe);
  } catch (error) {
    logger.error("httpGetUserId  | ERROR", error);
    res.status(400);
  }
}

async function httpUpdateFavoriteRecipes(req, res) {
  res.status(200).json(await updateFavoriteRecipes(req?.user?.uid, req.body));
}


module.exports = {
  httpCreateUser,
  httpGetUserId,
  updateFavoriteRecipes,
  httpUpdateFavoriteRecipes
};
