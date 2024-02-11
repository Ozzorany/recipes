const express = require('express');
const recipesRouter = require('./recipes/recipes.router');
const usersRouter = require('./users/users.router');


const api = express.Router();

api.use('/recipes', recipesRouter);
api.use('/users', usersRouter);


module.exports = api;



