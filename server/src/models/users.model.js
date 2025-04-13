//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const COLLECTION = "users";
const db = require("../firebase/db");
require("dotenv").config();

async function createUser(user) {
  const ref = await firestore.collection(COLLECTION);
  ref.doc(user.id).set(user);
  return user;
}

async function fetchUserById(userId, isFullData = true) {
  const docRef = firestore.collection(COLLECTION).doc(userId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) return null;

  const data = docSnap.data();
  if (!data) return null;

  if (!isFullData) {
    return {
      displayName: data.displayName ?? "",
      logo: data.logo ?? null,
    };
  }

  return data;
}

async function updateFavoriteRecipes(userId, { recipeId }) {
  const user = (await fetchUserById(userId)) || {};
  const favorites = user?.favoriteRecipes;

  const index = favorites?.indexOf(recipeId);
  if (index !== -1) {
    favorites?.splice(index, 1);
  } else {
    favorites?.push(recipeId);
  }

  const userRef = firestore.collection(COLLECTION).doc(user?.id);
  return await userRef.update(user);
}

async function addSharedGroup(userId, groupId) {
  const user = (await fetchUserById(userId)) || {};
  const sharedGroups = user?.sharedGroups;

  if (!sharedGroups?.includes(groupId)) {
    sharedGroups.push(groupId);
  }

  const userRef = firestore.collection(COLLECTION).doc(user?.id);
  return await userRef.update(user);
}

async function deleteGroupFromUsers(groupId) {
  try {
    const usersSnapshot = await firestore
      .collection(COLLECTION)
      .where("sharedGroups", "array-contains", groupId)
      .get();

    // Update each user document
    const batch = firestore.batch();
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const updatedSharedGroups = userData.sharedGroups.filter(
        (id) => id !== groupId
      );
      const userRef = firestore.collection(COLLECTION).doc(userDoc.id);
      batch.update(userRef, { sharedGroups: updatedSharedGroups });
    });

    // Commit the batch update
    await batch.commit();

    console.log(`Group ID ${groupId} deleted from users' sharedGroups.`);
  } catch (error) {
    console.error("Error deleting group ID from users:", error);
  }
}

async function fetchUserFeatures(userId) {
  const userRef = await firestore
    .collection("toggles")
    .where("users", "array-contains", userId)
    .get();
  return userRef.docs.map((doc) => doc.id);
}

module.exports = {
  createUser,
  fetchUserById,
  updateFavoriteRecipes,
  addSharedGroup,
  deleteGroupFromUsers,
  fetchUserFeatures,
};
