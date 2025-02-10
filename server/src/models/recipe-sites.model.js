//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const COLLECTION = "recipe_sites";
const cheerio = require("cheerio");
const axios = require("axios");
require("dotenv").config();

async function fetchRecipeSiteDataSelectors(url) {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    const userRef = await firestore
      .collection(COLLECTION)
      .where("siteDomain", "==", domain)
      .get();

    return { ok: true, data: userRef.docs[0].data() };
  } catch (error) {
    return {
      ok: false,
      data: {},
    };
  }
}

async function getRelevantHTML(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    return $("body").html() || html;
  } catch (e) {
    return "";
  }
}

module.exports = {
  fetchRecipeSiteDataSelectors,
  getRelevantHTML,
};
