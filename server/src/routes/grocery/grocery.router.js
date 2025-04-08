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
} = require("./grocery.controller");

const groceryRouter = express.Router();

// Grocery list routes
groceryRouter.get("/user-lists", httpGetUserGroceryLists);
groceryRouter.post("/create-list", httpCreateGroceryList);
groceryRouter.put("/:listId/edit", httpEditGroceryList);
groceryRouter.delete("/:listId", httpDeleteGroceryList);
groceryRouter.post("/:listId/add-user", httpAddUserToGroceryList);

// Grocery item routes
groceryRouter.post("/:listId/items", httpAddGroceryItems);
groceryRouter.put("/:listId/items/:itemId", httpEditGroceryItem);
groceryRouter.delete("/:listId/items/:itemId", httpRemoveGroceryItem);

module.exports = groceryRouter;
