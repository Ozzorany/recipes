//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const { v4: uuidv4 } = require("uuid");
const { fetchUserById } = require("./users.model");
const COLLECTION = "recipes";
const _ = require("lodash");
const {  fetchGroupsByIds } = require("./groups.model");

require("dotenv").config();

async function fetchRecipes(userId) {
  const user = await fetchUserById(userId);
  const { sharedGroups } = user;

  const userRecipes = (
    await firestore
      .collection(COLLECTION)
      .where("creatorId", "==", userId)
      .where("isDeleted", "!=", true)
      .get()
  ).docs.map((doc) => doc.data());

  const sharedGroupsRecipes = sharedGroups?.length > 0 ?(
    await firestore
      .collection(COLLECTION)
      .where("sharedGroups", "array-contains-any", sharedGroups)
      .where("isDeleted", "!=", true)
      .get()
  ).docs.map((doc) => doc.data()) : [];

  const unifiedRecipes = [...userRecipes, ...sharedGroupsRecipes];

  return _.uniqBy(unifiedRecipes, "id");
}

async function fetchRecipeById(recipeId) {
  const recipe = (await firestore.collection(COLLECTION).doc(recipeId).get()).data() || {};
  const recipeGroups = await fetchGroupsByIds(recipe?.sharedGroups || [])
  recipe.sharedGroups = recipeGroups;
  return recipe;
}

async function updateRecipe(recipe) {
  const cityRef = firestore.collection(COLLECTION).doc(recipe.id);
  const res = await cityRef.update(recipe);

  return recipe;
}

async function createRecipe(recipe) {
  const ref = await firestore.collection(COLLECTION);
  const newId = ref.doc().id;
  ref.doc(newId).set(recipe);
  recipe.id = newId;
  return recipe;
}

async function deleteRecipe(recipeId) {
  const recipe = (await firestore.collection(COLLECTION).doc(recipeId).get()).data() || {};
  recipe.isDeleted = true;
  
  const recipeRef = firestore.collection(COLLECTION).doc(recipeId);
  await recipeRef.update(recipe);
  
  return true;
}

async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const BUCKET = `gs://${process.env.BUCKET}`;
    const BUCKET_NAME = process.env.BUCKET;
    const bucket = firebase.storage().bucket(BUCKET);
    const uid = uuidv4();
    const fileToUpload = bucket.file(uid);

    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: uid,
      },
      contentType: "image/png",
      cacheControl: "public, max-age=31536000",
    };

    const stream = fileToUpload.createWriteStream(metadata);

    stream.on("error", (e) => {
      reject;
    });

    stream.on("finish", async (e) => {
      await fileToUpload.makePublic();
      file.firebaseUrl = `https://storage.googleapis.com/${BUCKET}/recipes`;

      resolve(
        `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${uid}?alt=media&token=${uid}`
      );
    });

    const ref = stream.end(file.buffer);
  });
}

module.exports = {
  fetchRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  uploadImage,
  fetchRecipeById,
};
