//@ts-check
const firebase = require("../firebase/db");
const { fetchUserById } = require("./users.model");
const firestore = firebase.firestore();
const COLLECTION = "groups";
require("dotenv").config();

async function fetchGroupById(groupId) {
  const recipeRef = await firestore.collection(COLLECTION).doc(groupId).get();
  return recipeRef.data();
}

async function fetchGroupsByIds(groupIds) {
  const recipeRef =
    (await groupIds?.length) > 0
      ? (
          await firestore
            .collection(COLLECTION)
            // @ts-ignore
            .where("id", "in", groupIds)
            .select("name", "id")
            .get()
        ).docs.map((doc) => doc.data())
      : [];

  return recipeRef;
}

async function fetchUserGroups(userId) {
  const user = (await fetchUserById(userId)) || {};

  // @ts-ignore
  const sharedGroupsRecipes =
    user.sharedGroups?.length > 0
      ? (
          await firestore
            .collection(COLLECTION)
            // @ts-ignore
            .where("id", "in", user.sharedGroups)
            .select("name", "id")
            .get()
        ).docs.map((doc) => doc.data())
      : [];

  return sharedGroupsRecipes || [];
}

module.exports = {
  fetchGroupById,
  fetchUserGroups,
  fetchGroupsByIds
};
