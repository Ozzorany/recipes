const {
  createGroceryList,
  editGroceryList,
  deleteGroceryList,
  addUserToGroceryList,
  addGroceryItem,
  editGroceryItem,
  removeGroceryItem,
  fetchUserGroceryLists,
} = require("../../models/grocery.model");

// Controller to get all grocery lists for a user
async function httpGetUserGroceryLists(req, res) {
  try {
    const userId = req.headers["uid"];
    if (!userId)
      return res
        .status(400)
        .json({ ok: false, error: "Missing user ID in headers" });

    const result = await fetchUserGroceryLists(userId);
    res.status(200).json({ ok: true, data: result });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

// Controller to create a new grocery list
async function httpCreateGroceryList(req, res) {
  const userId = req.headers["uid"];
  if (!userId)
    return res
      .status(400)
      .json({ ok: false, error: "Missing user ID in headers" });

  try {
    const result = await createGroceryList(userId, req.body);
    res.status(200).json({ ok: true, data: result });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

// Controller to edit a grocery list
async function httpEditGroceryList(req, res) {
  try {
    const listId = req.params.listId;
    const updates = req.body;
    await editGroceryList(listId, updates);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

// Controller to delete a grocery list
async function httpDeleteGroceryList(req, res) {
  try {
    const listId = req.params.listId;
    await deleteGroceryList(listId);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

// Controller to add a user to an existing grocery list
async function httpAddUserToGroceryList(req, res) {
  try {
    const listId = req.params.listId;
    const { userId } = req.body;
    await addUserToGroceryList(listId, userId);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

// Controller to add multiple grocery items to a list
async function httpAddGroceryItems(req, res) {
  try {
    const listId = req.params.listId;
    const items = req.body;
    const result = await addGroceryItem(listId, items);
    res.status(200).json({ ok: true, data: result });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

// Controller to edit a grocery item
async function httpEditGroceryItem(req, res) {
  try {
    const listId = req.params.listId;
    const itemId = req.params.itemId;
    const updates = req.body;
    await editGroceryItem(listId, itemId, updates);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

// Controller to remove a grocery item from a list
async function httpRemoveGroceryItem(req, res) {
  try {
    const listId = req.params.listId;
    const itemId = req.params.itemId;
    await removeGroceryItem(listId, itemId);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

module.exports = {
  httpCreateGroceryList,
  httpEditGroceryList,
  httpDeleteGroceryList,
  httpAddUserToGroceryList,
  httpAddGroceryItems,
  httpEditGroceryItem,
  httpRemoveGroceryItem,
  httpGetUserGroceryLists,
};
