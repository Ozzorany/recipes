const express = require("express");
const {
  httpCreateGroceryList,
  httpEditGroceryList,
  httpDeleteGroceryList,
  httpAddUserToGroceryList,
  httpAddGroceryItems,
  httpEditGroceryItem,
  httpRemoveGroceryItem,
  httpGetUserGroceryLists,
  httpGenerateGroceryInvitation,
  httpJoinGroceryList,
  httpExtractGroceryItems,
} = require("./grocery.controller");

const groceryRouter = express.Router();

// Grocery list routes
groceryRouter.get("/user-lists", httpGetUserGroceryLists);
groceryRouter.post("/create-list", httpCreateGroceryList);
groceryRouter.put("/:listId/edit", httpEditGroceryList);
groceryRouter.delete("/:listId", httpDeleteGroceryList);
groceryRouter.post("/:listId/add-user", httpAddUserToGroceryList);
groceryRouter.post(
  "/:listId/generate-invitation",
  httpGenerateGroceryInvitation
);
groceryRouter.post("/join", httpJoinGroceryList);

// Grocery item routes
groceryRouter.post("/:listId/items", httpAddGroceryItems);
groceryRouter.put("/:listId/items/:itemId", httpEditGroceryItem);
groceryRouter.delete("/:listId/items/:itemId", httpRemoveGroceryItem);

// Recipe to grocery items route
groceryRouter.post("/extract-items", httpExtractGroceryItems);

module.exports = groceryRouter;
