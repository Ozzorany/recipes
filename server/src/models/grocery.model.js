//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();

const GROCERY_LISTS = "grocery_lists";

/**
 * Fetch all grocery lists where the user is a member or the owner,
 * and include their grocery items
 * @param {string} userId
 */
async function fetchUserGroceryLists(userId) {
  const results = [];

  // Get lists where user is the owner
  const ownerSnap = await firestore
    .collection(GROCERY_LISTS)
    .where("ownerId", "==", userId)
    .get();

  results.push(
    ...ownerSnap.docs.map((doc) => ({
      id: doc.id,
      members: doc.data().members,
      isOwner: true,
      name: doc.data().name,
    }))
  );

  // Get lists where user is a member (not the owner)
  const memberSnap = await firestore
    .collection(GROCERY_LISTS)
    .where("members", "array-contains", userId)
    .get();

  const existingIds = new Set(results.map((r) => r.id));
  memberSnap.docs.forEach((doc) => {
    if (!existingIds.has(doc.id)) {
      const data = doc.data();
      results.push({
        id: doc.id,
        members: data.members,
        isOwner: false,
        name: doc.data().name,
      });
    }
  });

  const listsWithItems = await Promise.all(
    results.map(async (list) => {
      const itemsSnap = await firestore
        .collection(GROCERY_LISTS)
        .doc(list.id)
        .collection("items")
        .get();

      const items = itemsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { ...list, items };
    })
  );

  return listsWithItems;
}

/**
 * Create a new grocery list
 */
async function createGroceryList(userId, listData) {
  const ref = firestore.collection(GROCERY_LISTS);
  const newId = ref.doc().id;

  // Construct the new grocery list document
  const payload = {
    name: listData.name,
    ownerId: userId,
    members: [...(listData?.members || [])], // Ensure the owner is also a member
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
  };

  // Save the document
  await ref.doc(newId).set(payload);

  if (listData?.items?.length) {
    await addGroceryItem(newId, listData.items);
  }

  return { id: newId, ...payload };
}

/**
 * Add a user to a grocery list
 * @param {string} listId
 * @param {string} userId
 */
async function addUserToGroceryList(listId, userId) {
  const ref = firestore.collection(GROCERY_LISTS).doc(listId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("List not found");

  const data = doc.data();

  // Add user only if not already a member
  if (!data?.members.includes(userId)) {
    await ref.update({
      members: [...(data?.members || []), userId],
      updatedAt: new Date(),
    });
  }
  return true;
}

/**
 * Delete a grocery list
 * @param {string} listId
 */
async function deleteGroceryList(listId) {
  const listRef = firestore.collection(GROCERY_LISTS).doc(listId);

  // First delete all items in the subcollection
  const itemsSnapshot = await listRef.collection("items").get();
  const batch = firestore.batch();

  itemsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Then delete the main document
  batch.delete(listRef);

  // Commit the batch operation
  await batch.commit();
  return true;
}

/**
 * Edit a grocery list
 * @param {string} listId
 * @param {{ name?: string, isArchived?: boolean }} updates
 */
async function editGroceryList(listId, updates) {
  const ref = firestore.collection(GROCERY_LISTS).doc(listId);
  await ref.update({ ...updates, updatedAt: new Date() });
  return true;
}

/**
 * Add multiple grocery items to a list
 * @param {string} listId
 * @param {Array<{ name: string, amount?: string, category?: string, imageUrl?: string, addedBy: string }>} items
 */
async function addGroceryItem(listId, items) {
  const ref = firestore
    .collection(GROCERY_LISTS)
    .doc(listId)
    .collection("items");
  const batch = firestore.batch();
  const results = [];

  for (const item of items) {
    const newId = ref.doc().id;
    const payload = {
      ...item,
      isChecked: false,
      createdAt: new Date(),
    };
    batch.set(ref.doc(newId), payload);
    results.push({ id: newId, ...payload });
  }

  // Commit all item additions in a single batch write
  await batch.commit();
  return results;
}

/**
 * Remove a grocery item from a list
 * @param {string} listId
 * @param {string} itemId
 */
async function removeGroceryItem(listId, itemId) {
  await firestore
    .collection(GROCERY_LISTS)
    .doc(listId)
    .collection("items")
    .doc(itemId)
    .delete();
  return true;
}

/**
 * Edit a grocery item in a list
 * @param {string} listId
 * @param {string} itemId
 * @param {{ name?: string, amount?: string, category?: string, imageUrl?: string, isChecked?: boolean }} updates
 */
async function editGroceryItem(listId, itemId, updates) {
  const ref = firestore
    .collection(GROCERY_LISTS)
    .doc(listId)
    .collection("items")
    .doc(itemId);
  await ref.update(updates);
  return true;
}

/**
 * Fetch a grocery list by its ID
 * @param {string} listId
 */
async function fetchGroceryListById(listId) {
  const doc = await firestore.collection(GROCERY_LISTS).doc(listId).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  };
}

/**
 * Remove a user from a grocery list
 * @param {string} listId
 * @param {string} userId
 */
async function removeUserFromGroceryList(listId, userId) {
  const ref = firestore.collection(GROCERY_LISTS).doc(listId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("List not found");

  const data = doc.data();
  if (!data?.members.includes(userId)) {
    throw new Error("User is not a member of this list");
  }

  // Remove user from members array
  await ref.update({
    members: data.members.filter((memberId) => memberId !== userId),
    updatedAt: new Date(),
  });
  return true;
}

module.exports = {
  createGroceryList,
  addUserToGroceryList,
  deleteGroceryList,
  editGroceryList,
  addGroceryItem,
  removeGroceryItem,
  editGroceryItem,
  fetchUserGroceryLists,
  fetchGroceryListById,
  removeUserFromGroceryList,
};
