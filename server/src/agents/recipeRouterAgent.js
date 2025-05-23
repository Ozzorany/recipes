const { OpenAI } = require("openai");
const ExtractRecipeAgent = require("./extractRecipeAgent");
const IngredientsToRecipeAgent = require("./ingredientsToRecipeAgent");
const SuggestRecipeAgent = require("./suggestRecipeAgent");
const ModifyRecipeAgent = require("./modifyRecipeAgent");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const functions = [
  {
    name: "extract_recipe_from_text",
    description: "חילוץ מתכון מטקסט חופשי",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string", description: "טקסט שמכיל מתכון" },
      },
      required: ["text"],
    },
  },
  {
    name: "create_recipe_from_ingredients",
    description: "הפקת מתכון לפי רשימת מרכיבים",
    parameters: {
      type: "object",
      properties: {
        ingredients: {
          type: "array",
          items: { type: "string" },
          description: "רשימת מרכיבים",
        },
      },
      required: ["ingredients"],
    },
  },
  {
    name: "suggest_recipe",
    description: "המלצה על מתכון לפי תיאור כללי",
    parameters: {
      type: "object",
      properties: {
        context: {
          type: "string",
          description: "בקשה כללית כמו 'תן לי מתכון לארוחת ערב'",
        },
      },
      required: ["context"],
    },
  },
  {
    name: "modify_recipe",
    description: "שינוי מתכון לפי הערות משתמש",
    parameters: {
      type: "object",
      properties: {
        recipe: {
          type: "string",
          description: "המתכון המקורי",
        },
        comments: {
          type: "string",
          description: "הערות המשתמש לשינוי המתכון",
        },
      },
      required: ["recipe", "comments"],
    },
  },
];

const functionHandlers = {
  extract_recipe_from_text: ExtractRecipeAgent,
  create_recipe_from_ingredients: IngredientsToRecipeAgent,
  suggest_recipe: SuggestRecipeAgent,
  modify_recipe: ModifyRecipeAgent,
};

async function RecipeRouterAgent(input, userId) {
  try {
    const { choices } = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: typeof input === "string" ? input : JSON.stringify(input),
        },
      ],
      functions,
      function_call: "auto",
    });

    const call = choices[0].message.function_call;

    if (!call) {
      throw new AppError("בקשה לא רלוונטית", 400);
    }

    const fn = functionHandlers[call.name];
    const args = JSON.parse(call.arguments);

    return await fn(args, userId);
  } catch (error) {
    console.error("Error in RecipeRouterAgent:", error);
    throw new AppError(error.message, 500);
  }
}
module.exports = RecipeRouterAgent;
