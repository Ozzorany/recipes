const { OpenAI } = require("openai");
const { logger } = require("../logger");

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

module.exports = { generateOpenAiRequest };
