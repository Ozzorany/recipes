const { generateOpenAiRequest } = require("../models/openai.model");
async function ExtractRecipeAgent(body) {
  const { text } = body;
  const prompt = `
הטקסט הבא מכיל מידע על מתכון. תחלץ אותו ותחזיר בפורמט JSON:
הטקסט:
${text}
\n
#Rules:
- Response for example: {"title": "סלט ירקות, "ingredients": ["עגבניה", "0.5 כף מלח"], "method": "מערבבים הכל ביחד עד שנהיה לנו מרקם אחיד"}
- You do not need to mention the word Json in your response. Return only the response itself starting with { and ends with } If some text is not in hebrew, translate it to hebrew
- The method field should be only one string. Do not split it to objects.
- The ingredients field should be only one array of strings. Do not split it to multiple objects or arrays.
`.trim();

  const response = await generateOpenAiRequest({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o",
    temperature: 0.2,
    parse: true,
  });

  return response;
}

module.exports = ExtractRecipeAgent;
