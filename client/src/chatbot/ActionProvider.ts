import { ChatBotRecipePayload } from "../models/recipe.model";
import { httpRecipeChatbotResponse } from "../hooks/requests";

class ActionProvider {
  createChatBotMessage: any;
  setState: React.Dispatch<
    React.SetStateAction<{ messages: any[]; recipe: ChatBotRecipePayload }>
  >;
  createClientMessage: any;
  currentStateRef: any;
  children?: React.ReactNode;

  constructor(
    createChatBotMessage: any,
    setState: React.Dispatch<
      React.SetStateAction<{ messages: any[]; recipe: ChatBotRecipePayload }>
    >,
    createClientMessage: any,
    stateRef: any
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setState;
    this.createClientMessage = createClientMessage;
    this.currentStateRef = stateRef;
  }

  async handleUserMessage(message: string) {
    try {
      const loadingMessage = this.createChatBotMessage("רק רגע...⏳");
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, loadingMessage],
      }));
      const response = await httpRecipeChatbotResponse(
        message,
        this.currentStateRef.recipe
      );

      const botMessage = this.createChatBotMessage(response);

      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    } catch (error: any) {
      const errorMessage = this.createChatBotMessage(
        error?.response?.data?.error
      );
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  }
}

export default ActionProvider;
