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
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#5ccc9d',
    },
  },
});

export default config;
