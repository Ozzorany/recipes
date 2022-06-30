const express = require('express');
const recipesRouter = require('./recipes/recipes.router');

const api = express.Router();

api.use('/recipes', recipesRouter);

module.exports = api;



