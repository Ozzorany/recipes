//@ts-check
const {
  fetchRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  uploadImage,
  fetchRecipeById,
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
  res.status(200).json(await fetchRecipes(req?.params?.id));
}

async function httpGetRecipeById(req, res) {
  logger.info("httpGetRecipeById | GET");
  try {
    const recipe = await fetchRecipeById(req?.params?.id);
    res.status(200).json(recipe);
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
  res.status(200).json(await deleteRecipe(req.body.id));
}

async function httpUploadImage(req, res) {
  const response = await uploadImage(req.file);

  if (response) {
    res.status(200).json({ downloadUrl: response });
  }
}

module.exports = {
  httpGetAllRecipes,
  httpUpdateRecipe,
  httpDeleteRecipe,
  httpCreateRecipe,
  httpUploadImage,
  httpGetRecipeById,
};
