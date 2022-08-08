var admin = require("firebase-admin");
const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);
require("dotenv").config();

const db = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    storageBucket: `gs://${process.env.BUCKET}`,
  }),
});

module.exports = db;
