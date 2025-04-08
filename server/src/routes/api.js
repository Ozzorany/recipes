const express = require("express");
const recipesRouter = require("./recipes/recipes.router");
const usersRouter = require("./users/users.router");
const groupsRouter = require("./groups/groups.router");
const healthRouter = require("./health/health.router");
const groceryRouter = require("./grocery/grocery.router");

const admin = require("firebase-admin");

const api = express.Router();

const verifyToken = async (req, res, next) => {
  if (req?.headers?.authorization) {
    const idToken = req.headers?.authorization?.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken; // Attach the decoded token to the request object
    } catch (error) {
      console.error("Error verifying Firebase token:", error);
      res.status(403).json({ error: "Unauthorized" });
    }
  }

  await next();
};

// api.use(verifyToken);

const clientMW = async (req, res, next) => {
  if (req?.headers?.uid) {
    req.user = { uid: req?.headers?.uid }; // Attach the decoded token to the request object
  }

  await next();
};

api.use(clientMW);
api.use("/health", healthRouter);
api.use("/recipes", recipesRouter);
api.use("/users", usersRouter);
api.use("/groups", groupsRouter);
api.use("/grocery", groceryRouter);

module.exports = api;
