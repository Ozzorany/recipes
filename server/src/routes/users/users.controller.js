//@ts-check
const { deleteGroup } = require("../../models/groups.model");
const { fetchRecipesByCreatorOnly } = require("../../models/recipe.model");
const {
  createUser,
  fetchUserById,
  updateFavoriteRecipes,
} = require("../../models/users.model");
const _ = require("lodash");

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

function differentTags(objects) {
  const allTags = _.flatMap(objects, "tags");
  const uniqueTags = _.uniq(allTags);
  return uniqueTags.length;
}

async function httpCalculateUserLevel(req, res) {
  const userId = req?.user?.uid;
  const userRecipes = await fetchRecipesByCreatorOnly(userId);
  const diferrentTags = differentTags(userRecipes);
  let level = 0;

  if (userRecipes?.length >= 12 && diferrentTags >= 6) {
    level = 4;
  } else if (userRecipes?.length >= 10 && diferrentTags >= 5) {
    level = 3;
  } else if (userRecipes?.length >= 5 && diferrentTags >= 3) {
    level = 3;
  } else if (userRecipes?.length >= 2) {
    level = 2;
  }

  res.status(200).json({ level });
}

module.exports = {
  httpCreateUser,
  httpGetUserId,
  updateFavoriteRecipes,
  httpUpdateFavoriteRecipes,
  httpCalculateUserLevel,
};
