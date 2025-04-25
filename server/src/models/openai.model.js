const { OpenAI } = require("openai");
const { logger } = require("../logger");
const { PLANS } = require("../constants");
const admin = require("firebase-admin");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const checkAndUpdateUsage = async (userId) => {
  const userRef = admin.firestore().collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  const planId = userData.plan;

  const planRef = admin.firestore().collection("plans").doc(planId);
  const planDoc = await planRef.get();

  if (!planDoc.exists) {
    throw new Error("Plan not found");
  }

  const planData = planDoc.data();
  const now = new Date();
  const lastReset = userData.lastHourlyReset
    ? new Date(userData.lastHourlyReset.toDate())
    : new Date(0);

  // Reset hourly usage if more than an hour has passed
  if (now - lastReset > 3600000) {
    // 3600000 ms = 1 hour
    await userRef.update({
      hourlyUsage: 0,
      lastHourlyReset: now,
    });
    return true;
  }

  // Check if user has exceeded hourly limit
  if (userData.hourlyUsage >= planData.hourlyLimit) {
    throw new Error(`Hourly limit exceeded for ${planId} plan`);
  }

  return true;
};

const updateUsage = async (userId, tokens) => {
  const userRef = admin.firestore().collection("users").doc(userId);
  await userRef.update({
    hourlyUsage: admin.firestore.FieldValue.increment(tokens),
  });
};

const generateOpenAiRequest = async ({
  messages,
  model = "gpt-4",
  temperature = 0.3,
  parse = true,
  userId,
}) => {
  try {
    // Check and update usage before making the request
    await checkAndUpdateUsage(userId);

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });

    // Update usage after successful request
    const tokens = response.usage.total_tokens;
    await updateUsage(userId, tokens);

    return {
      ok: true,
      data: parse
        ? JSON.parse(response.choices[0].message.content)
        : response.choices[0].message.content,
    };
  } catch (e) {
    logger.error("generateOpenAiRequest", { error: e });
    return { ok: false, error: e };
  }
};

const generateOpenAiVoiceResponse = async ({
  input,
  model = "gpt-4o-mini-tts",
  voice = "fable",
  userId,
  planId = PLANS.FREE,
}) => {
  try {
    // Check and update usage before making the request
    await checkAndUpdateUsage(userId, planId);

    const res = await openai.audio.speech.create({
      model,
      input,
      voice,
      response_format: "mp3",
    });

    // Update usage after successful request
    // For voice responses, we'll estimate tokens based on input length
    const estimatedTokens = Math.ceil(input.length / 4); // Rough estimate
    await updateUsage(userId, estimatedTokens);

    const buffer = Buffer.from(await res.arrayBuffer());
    return { ok: true, data: buffer };
  } catch (e) {
    logger.error("generateOpenAiRequest", { error: e });
    return { ok: false, error: e };
  }
};

module.exports = { generateOpenAiRequest, generateOpenAiVoiceResponse };
