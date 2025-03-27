const { OpenAI } = require("openai");
const { logger } = require("../logger");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const generateOpenAiRequest = async ({
  messages,
  model = "gpt-4",
  temperature = 0.3,
  parse = true,
}) => {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });

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
  voice = "coral",
}) => {
  try {
    const res = await openai.audio.speech.create({
      model,
      input,
      voice,
      response_format: "mp3",
    });
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.promises.writeFile("response.mp3", buffer);
    return { ok: true, data: "" };
  } catch (e) {
    logger.error("generateOpenAiRequest", { error: e });
    return { ok: false, error: e };
  }
};

module.exports = { generateOpenAiRequest, generateOpenAiVoiceResponse };
