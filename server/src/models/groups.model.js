//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const COLLECTION = "groups";
require("dotenv").config();

async function fetchGroupById(groupId) {
  const recipeRef = await firestore.collection(COLLECTION).doc(groupId).get();
  return recipeRef.data();
}

module.exports = {
  fetchGroupById,
};
