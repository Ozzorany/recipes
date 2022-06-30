const express = require('express');
const {httpGetAllRecipes} = require('./recipes.controller');

const recipesRouter = express.Router();

recipesRouter.get('/', httpGetAllRecipes);

module.exports = recipesRouter;