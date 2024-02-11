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


module.exports = {
  createUser,
  fetchUserById
};