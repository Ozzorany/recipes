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
  assistantResponse,
  recipeSteps,
} = require("../../models/recipe.model");
const fs = require("fs");
const path = require("path");

const winston = require("winston");
const RecipeRouterAgent = require("../../agents/recipeRouterAgent");
const errorHandler = require("../../middleware/errorHandler");

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

    if (isGroupShared || recipe?.creatorId === userId) {
      const accessibleRecipe = { ...recipe };

      accessibleRecipe.sharedGroups = recipe.sharedGroups.filter(
        (sharedGroup) =>
          userGroups.some((userGroup) => userGroup.id === sharedGroup.id)
      );

      res.status(200).json({ ok: true, data: accessibleRecipe });
    } else {
      res.status(200).json({ ok: false, data: undefined });
    }
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
  const userId = req?.user?.uid;

  if (!url) return res.status(400).json({ error: "URL is required" });

  const response = await extractRecipe(url, userId);

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
  const userId = req?.user?.uid;

  logger.info("httpRecipeChatBotResponseRecipe | POST", { message, recipe });

  const response = await recipeChatBotResponse(message, recipe, userId);

  if (!response.ok) {
    logger.error("httpRecipeChatBotResponseRecipe | POST", {
      message,
      recipe,
      error: response?.error,
    });

    return errorHandler(response?.error, req, res);
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

async function httpAssistantResponse(req, res) {
  const { currentStep, question, recipe, allSteps } = req.body;

  const response = await assistantResponse(
    currentStep,
    allSteps,
    question,
    recipe
  );

  if (!response.ok || !response.data) {
    logger.error("httpAssistantResponse | POST", {
      currentStep,
      question,
      recipe,
      error: response?.error,
    });

    return res.status(400).json({ error: "Error processing question" });
  }

  const { speechResponse, nextStep } = response.data;

  if (!speechResponse || !speechResponse.audioBuffer) {
    logger.error("No audio buffer returned from TTS");
    return res.status(500).json({ error: "Failed to generate audio response" });
  }

  const audioBase64 = speechResponse.audioBuffer.toString("base64");

  res.status(200).json({
    nextStep,
    audio: audioBase64,
  });
}
async function httpRecipeSteps(req, res) {
  const { method } = req.body;

  const response = await recipeSteps(method);

  if (!response.ok) {
    logger.error("httpRecipeSteps | POST", {
      method,
      error: response?.error,
    });

    return res.status(400).json({ error: "Error processing method" });
  }

  res.status(200).json(response.data);
}

async function httpRecipeGeneratorHelper(req, res) {
  try {
    const { input } = req.body;
    const userId = req?.user?.uid;

    if (!input) {
      return res.status(400).json({ error: "חסרה בקשה" });
    }

    const recipe = await RecipeRouterAgent(input, userId);

    if (!recipe.ok) {
      return errorHandler(recipe.error, req, res);
    }

    return res.status(200).json(recipe);
  } catch (error) {
    return errorHandler(error, req, res);
  }
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
  httpAssistantResponse,
  httpRecipeSteps,
  httpRecipeGeneratorHelper,
};
