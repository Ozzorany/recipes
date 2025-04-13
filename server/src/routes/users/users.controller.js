//@ts-check
const { deleteGroup } = require("../../models/groups.model");
const { fetchRecipesByCreatorOnly } = require("../../models/recipe.model");
const {
  createUser,
  fetchUserById,
  updateFavoriteRecipes,
  fetchUserFeatures,
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
  const currentUserId = req.headers["uid"];
  if (!currentUserId)
    return res
      .status(400)
      .json({ ok: false, error: "Missing user ID in headers" });

  const userId = req?.params?.id || "";

  try {
    const user = await fetchUserById(userId, currentUserId === userId);
    res.status(200).json(user);
  } catch (error) {
    logger.error("httpGetUserId  | ERROR", error);
    res.status(400);
  }
}

async function httpUpdateFavoriteRecipes(req, res) {
  res.status(200).json(await updateFavoriteRecipes(req?.user?.uid, req.body));
}

function differentTags(objects) {
  if (objects?.length === 0) {
    return 0;
  }

  const allTags = _.flatMap(objects, "tags");
  const uniqueTags = _.uniq(allTags);
  return uniqueTags.length;
}

async function httpCalculateUserLevel(req, res) {
  const userId = req?.user?.uid || "";
  const userRecipes = (await fetchRecipesByCreatorOnly(userId)) || [];
  const diferrentTags = differentTags(userRecipes);
  let level = 0;

  if (userRecipes?.length >= 12 && diferrentTags >= 6) {
    level = 4;
  } else if (userRecipes?.length >= 10 && diferrentTags >= 5) {
    level = 3;
  } else if (userRecipes?.length >= 5 && diferrentTags >= 3) {
    level = 2;
  } else if (userRecipes?.length >= 2) {
    level = 1;
  }

  res.status(200).json({ level });
}

async function httpUserFeatures(req, res) {
  const userId = req?.user?.uid;

  if (!userId) {
    res.status(404);
  }

  res.status(200).json(await fetchUserFeatures(req?.user?.uid));
}
module.exports = {
  httpCreateUser,
  httpGetUserId,
  updateFavoriteRecipes,
  httpUpdateFavoriteRecipes,
  httpCalculateUserLevel,
  httpUserFeatures,
};
