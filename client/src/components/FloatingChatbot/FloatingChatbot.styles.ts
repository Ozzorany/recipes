import { IconButton } from "@mui/material";
import { styled } from "@mui/system";

export const ChatbotButton = styled(IconButton)({
  position: "fixed",
  bottom: "24px",
  right: "24px",
  backgroundColor: "white", 
  color: "#3b82f6", 
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  transition: "background-color 0.3s ease, transform 0.2s ease",
  zIndex: 1000,

  "&:hover": {
    backgroundColor: "#f0f0f0", 
    transform: "scale(1.1)", 
  },
});

export const ChatbotContainer = styled("div")({
  position: "fixed",
  bottom: "80px",
  right: "24px",
  backgroundColor: "white",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  overflow: "hidden",
  zIndex: 1000,
});

export const CloseButton = styled("button")({
  position: "absolute",
  top: "8px",
  right: "8px",
  background: "none",
  border: "none",
  color: "#555",
  fontSize: "18px",
  cursor: "pointer",

  "&:hover": {
    color: "#000",
  },
});
