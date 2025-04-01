//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const { v4: uuidv4 } = require("uuid");
const { fetchUserById } = require("./users.model");
const COLLECTION = "recipes";
const _ = require("lodash");
const { fetchGroupsByIds } = require("./groups.model");
const {
  generateOpenAiRequest,
  generateOpenAiVoiceResponse,
} = require("./openai.model");
const axios = require("axios");
const cheerio = require("cheerio");

const {
  fetchRecipeSiteDataSelectors,
  getRelevantHTML,
} = require("./recipe-sites.model");
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

function chunkString(str, size) {
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.substring(i, i + size));
  }
  return chunks;
}

async function extractWithAI(url) {
  try {
    const relevantHtml = await getRelevantHTML(url);
    const chunks = chunkString(relevantHtml, 5000);

    let extractedData = { title: "", ingredients: "", method: "" };

    for (const chunk of chunks) {
      const response = await generateOpenAiRequest({
        messages: [
          {
            role: "system",
            content:
              "Extract the recipe title, ingredients, and method from the provided HTML content. Ensure all data is extracted if available.",
          },
          {
            role: "user",
            content: `Extract recipe details from this HTML snippet:\n\n${chunk}\n\nReturn a JSON object with 'title' - it's a string, 'ingredients' - it's an array of strings, and 'method' - it's a string. If any field is missing, set it as an empty string, expect the ingredients - in this case put empty array. You do not need to mention the word Json in your response.
            Response for example: {"title": "מנה מצויינת", "ingredients": ["עגבניה", "0.5 כף מלח"], "method": ""}
            Return only the response itself starting with { and ends with }`,
          },
        ],
        model: "gpt-4o",
        parse: false,
        temperature: 0.1,
      });

      if (!response.ok) {
        continue;
      }

      let aiResponse;
      try {
        aiResponse = JSON.parse(response.data || "{}");
      } catch (parseError) {
        continue;
      }

      // Merge extracted parts
      extractedData.title = extractedData.title || aiResponse.title || "";
      extractedData.ingredients += aiResponse.ingredients
        ? ` ${aiResponse.ingredients}`
        : "";
      extractedData.method += aiResponse.method ? ` ${aiResponse.method}` : "";
    }

    return extractedData.title
      ? { data: extractedData, ok: true }
      : { ok: false };
  } catch (error) {
    console.error("AI extraction failed:", error);
    return { ok: false };
  }
}

async function extractSiteData(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const { data: siteSelctors } = await fetchRecipeSiteDataSelectors(url);

    const { ingredientsSelector, methodSelector, titleSelector } = siteSelctors;

    const title = $(titleSelector).first().text().trim();
    const method = $(methodSelector).first().text().trim();
    const ingredients = $(ingredientsSelector).first().text().trim();

    // If extraction fails, use AI with chunking
    if (!title || !method || !ingredients) {
      const aiData = await extractWithAI(url);
      if (!aiData.ok) return { ok: false };
      return { data: aiData.data, ok: true };
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
  
  Return an object structured as Json object with the following fields:
  - "title": The title of the dish.
  - "ingredients": An array of strings where each item is in the format "ingredient - quantity". remove line spaces - meaning make the string in one line and don't allow multiple lines for one ingredient string.
  - "method": A single string containing the full preparation steps as a paragraph.
  
  Response for example: {"title": "מנה מצויינת", "ingredients": ["עגבניה", "0.5 כף מלח"], "method": "מערבבים הכל ביחד עד שנהיה לנו מרקם אחיד"}
  You do not need to mention the word Json in your response. Return only the response itself starting with { and ends with } If some text is not in hebrew, translate it to hebrew`,
    },
  ];

  const response = await generateOpenAiRequest({
    messages,
    model: "gpt-4o",
    parse: true,
  });

  return response;
}

async function recipeChatBotResponse(userMessage, recipe) {
  try {
    const systemPrompt = `
אתה עוזר חכם שמתמקד אך ורק במתכונים.  
המשתמש מדבר איתך על המתכון הבא:

📌 **שם המתכון:**  
${recipe.title}

🥣 **מצרכים:**  
${recipe.ingredients.map((ingredient) => `- ${ingredient}`).join("\n")}

👨‍🍳 **הוראות הכנה:**  
${recipe.instructions}

🔹 **תפקידך:**  
- עזור למשתמש לשנות, לשפר או להבין טכניקות בישול.
- אם המשתמש מנסה לשאול על נושא אחר, ענה: "מנסה לשנות נושא הא? איך אפשר לעזור בקשר למתכון?"
`;
    return await generateOpenAiRequest({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "gpt-4o",
      temperature: 0.5,
      parse: false,
    });
  } catch (error) {
    logger.error("recipeChatBotResponse", { error });
    return { ok: false, error };
  }
}

async function recipeSteps(method) {
  const prompt = `
    Return only an ordered array of Hebrew strings, without any extra text, newline characters, or formatting like "json". 
    An example of a response should be: ["תחילה יש לערבב את הנוזלים בקערה", "לאחר מכן יש לשבור את הביצים בקערה"]
    "${method}"
  `;

  try {
    const response = await generateOpenAiRequest({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      temperature: 0.3,
      parse: true,
    });

    return { ok: true, data: response.data };
  } catch (error) {
    logger.error("recipeSteps", { error });
    return { ok: false, error };
  }
}

async function assistantResponse(currentStep, allSteps, question, recipe) {
  const prompt = `
  אתה עוזר קול אינטואיטיבי לבישול, שמתפקד כמו חבר במטבח.
  המטרה שלך היא לעזור למשתמש שמבשל כרגע ולא יכול להסתכל על הטלפון, אלא רק לשוחח איתך בקול.
  
  הנה פרטי המתכון המלא: ${recipe}
  השלבים המלאים של ההכנה: ${allSteps}
  השלב הנוכחי שהמשתמש נמצא בו הוא: "${currentStep}"
  והשאלה שהוא שאל היא: "${question}"
  
  ענה בקצרה, בטון נעים, ברור ומעשי — כאילו אתה עומד לידו במטבח.
  
  🔸 אם המשתמש מבקש את השלב הבא או הקודם — החזר רק את השלב הבא או הקודם לפי המתכון. תעשה את זה קצר וענייני רק את הפעולה הבאה או הקודמת שצריך לבצע.
  🔸 אם הוא שואל שאלה כללית שקשורה להכנה (למשל: "כמה זמן זה צריך?", "אני לא בטוח אם זה מוכן") — הסבר לו בקצרה וענייניות.
  🔸 אם הוא שואל שאלה שאינה קשורה בכלל למתכון — תגיד בעדינות שאתה רק עוזר לבישול ולא יכול לעזור בזה.
  🔸 אל תסביר שוב את כל השלבים או המתכון כולו — רק מה שרלוונטי כרגע.
  🔸 שמור על תשובה קצרה ככל האפשר, ותכתוב אותה בעברית טבעית ונוחה, כאילו אתה מדבר עם חבר.
  
  החזר תשובה בפורמט JSON (בלי לציין את המילה JSON עצמה), עם השדות הבאים:
  - speech – המלל שאתה אמור להקריא למשתמש.
  - nextStep – הפעולה הנוכחית שהמשתמש צריך לבצע. 
  `;

  try {
    const response = await generateOpenAiRequest({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      temperature: 0.5,
      parse: true,
    });

    const { speech, nextStep } = response.data;

    const speechResponse = await generateOpenAiVoiceResponse({ input: speech });

    return { ok: true, data: { speechResponse, nextStep: speech } };
  } catch (error) {
    logger.error("assistantResponse", { error });
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
  recipeSteps,
  assistantResponse,
};
