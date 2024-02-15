const express = require("express");
const {
  httpCreateUser, httpGetUserId, httpUpdateFavoriteRecipes,
} = require("./users.controller");

const usersRouter = express.Router();

usersRouter.post("/create", httpCreateUser);
usersRouter.get("/:id", httpGetUserId);
usersRouter.post("/favorite-recipes", httpUpdateFavoriteRecipes)

module.exports = usersRouter;
