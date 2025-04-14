const { generateOpenAiRequest } = require("../models/openai.model");

async function IngredientsToRecipeAgent(body) {
  const prompt = `
צור מתכון בעברית שמתבסס רק על המצרכים הבאים:
${body.ingredients?.join(", ")} \n

  Response for example: {"title": "סלט ירקות, "ingredients": ["עגבניה", "0.5 כף מלח"], "method": "מערבבים הכל ביחד עד שנהיה לנו מרקם אחיד"}
  You do not need to mention the word Json in your response. Return only the response itself starting with { and ends with } If some text is not in hebrew, translate it to hebrew
`.trim();

  const response = await generateOpenAiRequest({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o",
    temperature: 0.7,
    parse: true,
  });

  return response;
}

module.exports = IngredientsToRecipeAgent;
