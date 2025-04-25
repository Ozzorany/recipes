const { generateOpenAiRequest } = require("../models/openai.model");

async function SuggestRecipeAgent(description, userId) {
  const { context } = description;
  const prompt = `
המשתמש ביקש שתעזור לו לחשוב על ארוחה עם הבקשה הבאה: "${context}" \n
  #Rules:
  - Response for example: {"title": "סלט ירקות, "ingredients": ["עגבניה", "0.5 כף מלח"], "method": "מערבבים הכל ביחד עד שנהיה לנו מרקם אחיד"}
  - You do not need to mention the word Json in your response. Return only the response itself starting with { and ends with } If some text is not in hebrew, translate it to hebrew
  - תבין את הבקשה ותציע רק מתכון אחד שמתאים לה בצורה הטובה ביותר.
`.trim();

  const response = await generateOpenAiRequest({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o",
    temperature: 0.5,
    parse: true,
    userId,
  });

  return response;
}

module.exports = SuggestRecipeAgent;
