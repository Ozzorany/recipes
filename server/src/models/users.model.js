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

async function fetchUserById(userId) {
  const userRef = await firestore.collection(COLLECTION).doc(userId).get();
  return userRef.data();
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

module.exports = {
  createUser,
  fetchUserById,
  updateFavoriteRecipes,
  addSharedGroup
};
