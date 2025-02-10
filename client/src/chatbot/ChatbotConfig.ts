import { createChatBotMessage } from "react-chatbot-kit";
import { ChatBotRecipePayload } from "../models/recipe.model";

const botName = "RecipeBot";

const config = (recipe: ChatBotRecipePayload) => ({
  botName,
  initialMessages: [createChatBotMessage(`היי! יש לך שאלות על המתכון?`, {})],
  state: {
    recipe,
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: '#00bfa6',
    },
    chatButton: {
      backgroundColor: '#00bfa6',
    },
  }
});

export default config;
