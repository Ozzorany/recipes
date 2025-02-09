//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const { v4: uuidv4 } = require("uuid");
const { fetchUserById } = require("./users.model");
const COLLECTION = "recipes";
const _ = require("lodash");
const { fetchGroupsByIds } = require("./groups.model");
const { generateOpenAiRequest } = require("./openai.model");
const axios = require("axios");
const cheerio = require("cheerio");
const { fetchRecipeSiteDataSelectors } = require("./recipe-sites.model");
const { logger } = require("../logger");

require("dotenv").config();

async function fetchRecipes(userId) {
  const user = await fetchUserById(userId);
  const { sharedGroups } = user || {};

  const userRecipes = (
    await firestore
      .collection(COLLECTION)
      .where("creatorId", "==", userId)
      .where("isDeleted", "!=", true)
      .get()
  ).docs.map((doc) => doc.data());

  const sharedGroupsRecipes =
    sharedGroups?.length > 0
      ? (
          await firestore
            .collection(COLLECTION)
            .where("sharedGroups", "array-contains-any", sharedGroups)
            .where("isDeleted", "!=", true)
            .get()
        ).docs.map((doc) => doc.data())
      : [];

  const unifiedRecipes = [...userRecipes, ...sharedGroupsRecipes];

  return _.uniqBy(unifiedRecipes, "id");
}

async function fetchRecipesByCreatorOnly(userId) {
  const userRecipes = (
    await firestore
      .collection(COLLECTION)
      .where("creatorId", "==", userId)
      .where("isDeleted", "!=", true)
      .get()
  ).docs.map((doc) => doc.data());

  return userRecipes;
}

async function fetchRecipeById(recipeId) {
  const recipe =
    (await firestore.collection(COLLECTION).doc(recipeId).get()).data() || {};
  const recipeGroups = await fetchGroupsByIds(recipe?.sharedGroups || []);
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
  const newRecipePayload = {
    ...recipe,
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
  };
  ref.doc(newId).set(newRecipePayload);
  newRecipePayload.id = newId;
  return newRecipePayload;
}

async function deleteRecipe(recipeId) {
  const recipe =
    (await firestore.collection(COLLECTION).doc(recipeId).get()).data() || {};
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

async function updateRecipeLikes(userId, recipeId) {
  const recipe = (await fetchRecipeById(recipeId)) || {};

  if (!recipe?.likes) {
    recipe.likes = [];
  }

  const likes = recipe?.likes;

  const index = likes?.indexOf(userId);
  if (index !== -1) {
    likes?.splice(index, 1);
  } else {
    likes?.push(userId);
  }

  const userRef = firestore.collection(COLLECTION).doc(recipe?.id);
  return await userRef.update("likes", likes);
}

async function extractSiteData(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const siteSelctors = await fetchRecipeSiteDataSelectors(url);
    const { ingredientsSelector, methodSelector, titleSelector } = siteSelctors;

    const title = $(titleSelector).first().text().trim();
    const method = $(methodSelector).first().text().trim();
    const ingredients = $(ingredientsSelector).first().text().trim();
    if (!title || !method) {
      return { ok: false };
    }
    return { data: { title, method, ingredients }, ok: true };
  } catch (error) {
    return { ok: false };
  }
}

async function extractRecipe(url) {
  const { ok, data } = await extractSiteData(url);

  if (!ok || !data) {
    return { ok: false };
  }

  const { title, method, ingredients } = data;

  const messages = [
    {
      role: "system",
      content: "You are an AI that extracts structured JSON recipes from text.",
    },
    {
      role: "user",
      content: `Title: ${title}
  
  Method:
  ${method}
  
  Ingredients:
  ${ingredients}
  
  Return a structured JSON with:
  - "title": The title of the dish.
  - "ingredients": An array of strings where each item is in the format "ingredient - quantity". remove line spaces - meaning make the string in one line and don't allow multiple lines for one ingredient string.
  - "method": A single string containing the full preparation steps as a paragraph.
  
  Now extract the structured recipe in JSON format. If some text is not in hebrew, translate it to hebrew`,
    },
  ];

  return await generateOpenAiRequest(messages);
}

async function recipeChatBotResponse(userMessage, recipe) {
  try {
    const systemPrompt = `
      You are a helpful AI that only discusses recipes. 
      The user is talking about the following recipe:

      Title: ${recipe.title}
      Ingredients: ${recipe.ingredients.join(", ")}
      Instructions: ${recipe.instructions}

      Your goal:
      - Help the user with recipe modifications, improvements, or cooking techniques.
      - If the user asks about a different topic, respond with: "מנסה לשנות נושא הא? איך אפשר לעזור בקשר למתכון?"
    `;

    return await generateOpenAiRequest(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      0.7,
      false
    );
  } catch (error) {
    logger.error("recipeChatBotResponse", { error });
    return { ok: false, error };
  }
}

module.exports = {
  fetchRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  uploadImage,
  fetchRecipeById,
  fetchRecipesByCreatorOnly,
  updateRecipeLikes,
  extractRecipe,
  recipeChatBotResponse,
};
