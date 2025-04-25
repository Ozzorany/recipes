const { OpenAI } = require("openai");
const { generateOpenAiRequest } = require("../models/openai.model");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

async function ModifyRecipeAgent({ recipe, comments }, userId) {
  try {
    const response = await generateOpenAiRequest({
      messages: [
        {
          role: "system",
          content: `אתה מומחה בבישול שמתאים מתכונים לפי הערות והעדפות של משתמשים. תפקידך לשנות את המתכון בהתאם להערות המשתמש תוך שמירה על המבנה הבסיסי של המתכון.
            #Rules:
            - Response for example: {"title": "סלט ירקות, "ingredients": ["עגבניה", "0.5 כף מלח"], "method": "מערבבים הכל ביחד עד שנהיה לנו מרקם אחיד"}
            - You do not need to mention the word Json in your response. Return only the response itself starting with { and ends with } If some text is not in hebrew, translate it to hebrew
            - The method field should be only one string. Do not split it to objects.
            - The ingredients field should be only one array of strings. Do not split it to multiple objects or arrays.
            - Do not add any extra fields to the recipe json response.
            - If the user asks for some change in the recipe, you should also change the method if needed - not only the ingredients.
            - If the user asks for irrelevant changes, you should not change the recipe.
            `,
        },
        {
          role: "user",
          content: `הנה המתכון המקורי:\n${JSON.stringify(
            recipe,
            null,
            2
          )}\n\nהערות המשתמש:\n${comments}\n\nאנא התאם את המתכון בהתאם להערות.`,
        },
      ],
      model: "gpt-4.1",
      temperature: 0.4,
      parse: true,
      userId,
    });

    return response;
  } catch (error) {
    console.error("Error in ModifyRecipeAgent:", error);
    return {
      ok: false,
      error: "שגיאה בעיבוד המתכון",
    };
  }
}

module.exports = ModifyRecipeAgent;
