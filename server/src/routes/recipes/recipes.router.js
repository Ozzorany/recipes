const express = require("express");
const multer = require("multer");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });
const {
  httpGetAllRecipes,
  httpUpdateRecipe,
  httpDeleteRecipe,
  httpCreateRecipe,
  httpUploadImage,
  httpGetRecipeById,
  httpUpdateRecipeLikes,
  httpExtractRecipe,
  httpRecipeChatBotResponseRecipe,
  httpAssistantResponse,
  httpRecipeSteps,
} = require("./recipes.controller");

const recipesRouter = express.Router();

recipesRouter.get("/", httpGetAllRecipes);
recipesRouter.get("/:id", httpGetRecipeById);
recipesRouter.post("/update", httpUpdateRecipe);
recipesRouter.post("/update/likes", httpUpdateRecipeLikes);
recipesRouter.post("/delete", httpDeleteRecipe);
recipesRouter.post("/create", httpCreateRecipe);
recipesRouter.post("/upload-image", upload.single("image"), httpUploadImage);
recipesRouter.post("/extract-recipe", httpExtractRecipe);
recipesRouter.post("/recipe-chatbot-response", httpRecipeChatBotResponseRecipe);
recipesRouter.post("/recipe-steps", httpRecipeSteps);
recipesRouter.post("/recipe-assistant-response", httpAssistantResponse);

module.exports = recipesRouter;
