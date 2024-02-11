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
  httpGetRecipeById
} = require("./recipes.controller");

const recipesRouter = express.Router();

recipesRouter.get("/:id", httpGetRecipeById);
recipesRouter.get("/all/:userId", httpGetAllRecipes);
recipesRouter.post("/update", httpUpdateRecipe);
recipesRouter.post("/create", httpCreateRecipe);
recipesRouter.post("/upload-image", upload.single("image"), httpUploadImage);
recipesRouter.delete("/", httpDeleteRecipe);

module.exports = recipesRouter;
