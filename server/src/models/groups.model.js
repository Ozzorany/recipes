//@ts-check
const firebase = require("../firebase/db");
const { fetchUserById, addSharedGroup } = require("./users.model");
const firestore = firebase.firestore();
const COLLECTION = "groups";
require("dotenv").config();

async function fetchGroupById(groupId) {
  const groupRef = await firestore.collection(COLLECTION).doc(groupId).get();
  return groupRef.data();
}

async function fetchGroupsByIds(groupIds) {
  const groupRef =
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

  return groupRef;
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
            logo: userData.logo,
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

async function addUserToGroup(groupId, userId) {
  const group = (await fetchGroupById(groupId)) || {};
  const groupUsersIds = group?.users?.map((user) => user.userId);

  if (!groupUsersIds?.includes(userId)) {
    group.users.push({ userId });
  }

  await addSharedGroup(userId, groupId);

  const groupRef = firestore.collection(COLLECTION).doc(groupId);
  return await groupRef.update(group);
}

async function createNewGroup(body, userId) {
  const { name, groupId } = body || {};
  const ref = await firestore.collection(COLLECTION);

  if (groupId === "") {
    const newGroup = await ref.add({
      name,
      managerId: userId,
      users: [{ userId: userId }],
    });
    ref.doc(newGroup.id).update({ id: newGroup.id });

    await addSharedGroup(userId, newGroup.id);
  } else {
    ref.doc(groupId).update({ name });
  }

  return { success: true };
}

module.exports = {
  fetchGroupById,
  fetchUserGroups,
  fetchGroupsByIds,
  fetchUserManagementGroups,
  addUserToGroup,
  createNewGroup,
};
