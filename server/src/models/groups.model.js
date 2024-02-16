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

async function fetchUserManagementGroups(userId) {
  const user = (await fetchUserById(userId)) || {};

  if (user?.sharedGroups?.length === 0) {
    return { managedGroups: [], sharedGroups: [] };
  }

  // @ts-ignore
  const sharedGroupsRecipes = await firestore
    .collection(COLLECTION)
    // @ts-ignore
    .where("id", "in", user.sharedGroups)
    .select("name", "id", "users", "managerId")
    .get();

  const groupData = sharedGroupsRecipes.docs.map(async (doc) => {
    const group = doc.data();
    // Fetch user objects for each user ID in the 'users' array
    const userObjects = await Promise.all(
      group.users.map(async (data) => {
        const userDoc = await firestore
          .collection("users")
          .doc(data.userId)
          .get();
        if (userDoc.exists) {
          const userData = userDoc.data() || {};
          return {
            displayName: userData.displayName,
            email: userData.email,
            id: userData.id,
            logo: userData.logo
          };
        } else {
          return null;
        }
      })
    );
    group.users = userObjects.filter((user) => user !== null); // Remove nulls if any user is not found
    return group;
  });

  const groups = await Promise.all(groupData);

  const managedByUser = groups?.filter(
    (group) => group?.managerId === user?.id
  );
  const sharedWithUser = groups?.filter(
    (group) => group?.managerId !== user?.id
  );

  return { managedGroups: managedByUser, sharedGroups: sharedWithUser };
}

module.exports = {
  fetchGroupById,
  fetchUserGroups,
  fetchGroupsByIds,
  fetchUserManagementGroups,
};
