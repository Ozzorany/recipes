const {
  createGroceryList,
  editGroceryList,
  deleteGroceryList,
  addUserToGroceryList,
  addGroceryItem,
  editGroceryItem,
  removeGroceryItem,
  fetchUserGroceryLists,
  fetchGroceryListById,
} = require("../../models/grocery.model");
const jwt = require("jsonwebtoken");

const winston = require("winston");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

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

// Controller to generate invitation link for a grocery list
async function httpGenerateGroceryInvitation(req, res) {
  const userId = req.headers["uid"];
  const listId = req.params.listId;

  if (!userId) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing user ID in headers" });
  }

  try {
    const list = await fetchGroceryListById(listId);
    if (!list) {
      return res.status(404).json({ ok: false, error: "List not found" });
    }

    if (list.ownerId !== userId) {
      return res.status(403).json({
        ok: false,
        error: "Only the list owner can generate invitations",
      });
    }

    // @ts-ignore
    const { secretKey } = JSON.parse(process.env.JWT_SECRET_KEY);
    // expired in 10 minutes
    const token = jwt.sign({ listId }, secretKey, { expiresIn: 600 });

    const invitationLink = encodeURI(
      `https://recipes-e6692.web.app/grocery-lists/join?listName=${list.name}&token=${token}`
    );

    res.status(200).json({ ok: true, data: invitationLink });
  } catch (error) {
    logger.error("httpGenerateGroceryInvitation | ERROR", error);
    res.status(400).json({ ok: false, error: error.message });
  }
}

// Controller to join a grocery list using invitation token
async function httpJoinGroceryList(req, res) {
  const userId = req.headers["uid"];
  const { token } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing user ID in headers" });
  }

  try {
    // @ts-ignore
    const { secretKey } = JSON.parse(process.env.JWT_SECRET_KEY);

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err || Date.now() >= decoded?.exp * 1000) {
        return res
          .status(400)
          .json({ ok: false, error: "Invalid or expired invitation link" });
      }

      const { listId } = decoded;
      await addUserToGroceryList(listId, userId);
      res.status(200).json({ ok: true });
    });
  } catch (error) {
    logger.error("httpJoinGroceryList | ERROR", error);
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
  httpGenerateGroceryInvitation,
  httpJoinGroceryList,
};
