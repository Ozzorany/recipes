//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const { v4: uuidv4 } = require("uuid");
const COLLECTION = "recipes";
const { storage } = require("../firebase/db");
const db = require("../firebase/db");
require("dotenv").config();

async function fetchRecipes() {
  const recipesRef = firestore.collection(COLLECTION).get();
  return (await recipesRef).docs.map((doc) => doc.data());
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
  const res = await firestore.collection(COLLECTION).doc(recipeId).delete();
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

      resolve(`https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${uid}?alt=media&token=${uid}`);
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
};
