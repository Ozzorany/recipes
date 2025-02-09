const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const generateOpenAiRequest = async (messages) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.3,
    });

    return { ok: true, data: JSON.parse(response.choices[0].message.content) };
  } catch (e) {
    return { ok: false, error: e };
  }
};

module.exports = { generateOpenAiRequest };
