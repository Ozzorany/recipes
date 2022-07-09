const express = require('express');
const {httpGetAllRecipes, httpUpdateRecipe, httpDeleteRecipe, httpCreateRecipe} = require('./recipes.controller');

const recipesRouter = express.Router();

recipesRouter.get('/', httpGetAllRecipes);
recipesRouter.post('/', httpUpdateRecipe);
recipesRouter.post('/create', httpCreateRecipe);
recipesRouter.delete('/:id', httpDeleteRecipe);

module.exports = recipesRouter;