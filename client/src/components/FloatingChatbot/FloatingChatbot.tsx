import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../../chatbot/ChatbotConfig";
import MessageParser from "../../chatbot/MessageParser";
import ActionProvider from "../../chatbot/ActionProvider";
import {
  ChatbotButton,
  ChatbotContainer,
  CloseButton,
} from "./FloatingChatbot.styles";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import { FloatingChatbotProps } from "./FloatingChatbot.types";
import { ChatBotRecipePayload } from "../../models/recipe.model";

const FloatingChatbot = ({ recipe }: FloatingChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ChatbotButton onClick={() => setIsOpen((prev) => !prev)}>
        <FaceRetouchingNaturalIcon fontSize="large" />
      </ChatbotButton>

      {isOpen && (
        <ChatbotContainer>
          <Chatbot
            config={config(recipe)}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            placeholderText="דברו אליי, קדימה"
            headerText="שיחה עם בוט המתכונים"
          />
          <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
        </ChatbotContainer>
      )}
    </div>
  );
};

export default FloatingChatbot;
