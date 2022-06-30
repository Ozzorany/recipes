const express = require('express');
const {httpGetAllRecipes, httpUpdateRecipe, httpDeleteRecipe} = require('./recipes.controller');

const recipesRouter = express.Router();

recipesRouter.get('/', httpGetAllRecipes);
recipesRouter.post('/', httpUpdateRecipe);
recipesRouter.delete('/:id', httpDeleteRecipe);

module.exports = recipesRouter;