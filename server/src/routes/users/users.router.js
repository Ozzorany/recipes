const express = require("express");
const {
  httpCreateUser, httpGetUserId, httpUpdateFavoriteRecipes, httpCalculateUserLevel,
} = require("./users.controller");

const usersRouter = express.Router();

usersRouter.post("/create", httpCreateUser);
usersRouter.get("/details/:id", httpGetUserId);
usersRouter.post("/favorite-recipes", httpUpdateFavoriteRecipes)
usersRouter.get("/level", httpCalculateUserLevel);

module.exports = usersRouter;
