//@ts-check
const { fetchUserGroups } = require("../../models/groups.model");
const {
  fetchRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  uploadImage,
  fetchRecipeById,
  updateRecipeLikes,
  extractRecipe,
  recipeChatBotResponse,
} = require("../../models/recipe.model");

const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

async function httpGetAllRecipes(req, res) {
  logger.info("httpGetAllRecipes | GET");
  console.log("httpGetAllRecipes | GET");
  res.status(200).json(await fetchRecipes(req?.user?.uid));
}

async function httpGetRecipeById(req, res) {
  logger.info("httpGetRecipeById | GET");
  try {
    const userId = req?.user?.uid;
    const userGroups = await fetchUserGroups(userId);
    const recipe = await fetchRecipeById(req?.params?.id);

    const isGroupShared = userGroups.some((userGroup) => {
      return recipe?.sharedGroups.find(
        (sharedGroup) => sharedGroup.id === userGroup.id
      );
    });

    res
      .status(200)
      .json(
        isGroupShared || recipe?.creatorId === userId
          ? { ok: true, data: recipe }
          : { ok: false, data: undefined }
      );
  } catch (error) {
    logger.error("httpGetRecipeById  | ERROR", error);
    res.status(400);
  }
}

async function httpUpdateRecipe(req, res) {
  res.status(200).json(await updateRecipe(req.body));
}

async function httpCreateRecipe(req, res) {
  res.status(200).json(await createRecipe(req.body));
}

async function httpDeleteRecipe(req, res) {
  res.status(200).json(await deleteRecipe(req.body.recipeId));
}

async function httpExtractRecipe(req, res) {
  const url = req.body.url;

  if (!url) return res.status(400).json({ error: "URL is required" });

  const response = await extractRecipe(url);

  if (!response.ok) {
    return res
      .status(400)
      .json({ error: "An issue occured. Please try again later" });
  }

  res.status(200).json(response.data);
}

async function httpRecipeChatBotResponseRecipe(req, res) {
  const message = req.body.message;
  const recipe = req.body.recipe;

  const response = await recipeChatBotResponse(message, recipe);

  if (!response.ok) {
    return res
      .status(400)
      .json({ error: "An issue occured. Please try again later" });
  }

  res.status(200).json(response.data);
}

async function httpUploadImage(req, res) {
  const response = await uploadImage(req.file);

  if (response) {
    res.status(200).json({ downloadUrl: response });
  }
}

async function httpUpdateRecipeLikes(req, res) {
  const { recipeId } = req.body;
  res.status(200).json(await updateRecipeLikes(req?.user?.uid, recipeId));
}

module.exports = {
  httpGetAllRecipes,
  httpUpdateRecipe,
  httpDeleteRecipe,
  httpExtractRecipe,
  httpCreateRecipe,
  httpUploadImage,
  httpGetRecipeById,
  httpUpdateRecipeLikes,
  httpRecipeChatBotResponseRecipe,
};
