//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const COLLECTION = "recipe_sites";
require("dotenv").config();

async function fetchRecipeSiteDataSelectors(url) {
  const domain = new URL(url).hostname.replace("www.", "");
  const userRef = await firestore
    .collection(COLLECTION)
    .where("siteDomain", "==", domain)
    .get();

  return userRef.docs[0].data();
}

module.exports = {
  fetchRecipeSiteDataSelectors,
};
