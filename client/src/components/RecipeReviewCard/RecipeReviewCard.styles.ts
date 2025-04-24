import { SxProps, Theme } from "@mui/material";

export const cardStyles: SxProps<Theme> = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
};

export const titleStyles: SxProps<Theme> = {
  fontSize: "1.2rem",
  fontWeight: 500,
  cursor: "pointer",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  "&:hover": {
    color: "primary.main",
  },
};

export const mediaStyles: SxProps<Theme> = {
  height: 250,
  width: "100%",
  position: "relative",
  "&::before": {
    content: '""',
    display: "block",
    paddingTop: "56.25%", // 16:9 aspect ratio
  },
  "& img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
};

export const noImageStyles: SxProps<Theme> = {
  ...mediaStyles,
  "& img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
  },
};

export const tagStyles: SxProps<Theme> = {
  backgroundColor: "primary.light",
  color: "white",
  fontSize: "0.75rem",
  height: "24px",
  padding: "0 8px",
  "& .MuiChip-label": {
    padding: "0 4px",
  },
  "&:hover": {
    backgroundColor: "primary.main",
  },
};

export const likeButtonStyles: SxProps<Theme> = {
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
  },
};

export const likeIconStyles = {
  transition: "color 0.2s ease-in-out",
};

export const menuIconStyles: SxProps<Theme> = {
  mr: 1,
};

export const cardContentStyles: SxProps<Theme> = {
  flexGrow: 1,
  display: "flex",
  justifyContent: "start",
};

export const tagsContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 0.5,
  minHeight: "2.5rem",
  alignItems: "start",
};
