import { SxProps, Theme } from "@mui/material";

export const cardStyles: SxProps<Theme> = (theme) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  transition: theme.transitions.create(["transform", "box-shadow"], {
    duration: theme.transitions.duration.shorter,
  }),
  boxShadow: theme.shadows[1],
  margin: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(0.5),
  },
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
});

export const titleStyles: SxProps<Theme> = (theme) => ({
  ...theme.typography.subtitle1,
  fontWeight: 500,
  cursor: "pointer",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
  minHeight: theme.spacing(6),
  lineHeight: 1.4,
  transition: theme.transitions.create("color"),
  color: theme.palette.text.primary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
});

export const mediaStyles: SxProps<Theme> = (theme) => ({
  position: "relative",
  width: "100%",
  height: theme.spacing(30),
  borderTopLeftRadius: theme.spacing(2),
  borderTopRightRadius: theme.spacing(2),
  overflow: "hidden",
  "& img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shorter,
    }),
  },
  "&:hover img": {
    transform: "scale(1.03)",
  },
  [theme.breakpoints.down("sm")]: {
    height: theme.spacing(30),
  },
});

export const noImageStyles: SxProps<Theme> = (theme) => ({
  ...mediaStyles(theme),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "fill",
    objectPosition: "center",
    opacity: 0.7,
    transition: theme.transitions.create(["transform", "opacity"], {
      duration: theme.transitions.duration.shorter,
    }),
  },
  "&:hover img": {
    transform: "scale(1.03)",
    opacity: 0.9,
  },
  "&::after": {
    position: "absolute",
    color: theme.palette.text.secondary,
    ...theme.typography.body2,
    textAlign: "center",
    padding: theme.spacing(2),
  },
});

export const tagStyles: SxProps<Theme> = (theme) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.getContrastText(theme.palette.primary.light),
  fontSize: theme.typography.caption.fontSize,
  height: theme.spacing(3),
  padding: theme.spacing(0, 1),
  transition: theme.transitions.create(["background-color", "transform"], {
    duration: theme.transitions.duration.shorter,
  }),
  "& .MuiChip-label": {
    padding: theme.spacing(0, 0.5),
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "translateY(-1px)",
  },
});

export const likeButtonStyles: SxProps<Theme> = (theme) => ({
  position: "relative",
  transition: theme.transitions.create(
    ["transform", "background-color", "box-shadow"],
    {
      duration: theme.transitions.duration.shorter,
    }
  ),
  padding: theme.spacing(0.75),
  borderRadius: "50%",
  backgroundColor: "transparent",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "50%",
    backgroundColor: theme.palette.error.light,
    opacity: 0,
    transform: "scale(0.8)",
    transition: theme.transitions.create(["opacity", "transform"], {
      duration: theme.transitions.duration.shorter,
    }),
  },
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: "transparent",
    "&::before": {
      opacity: 0.1,
      transform: "scale(1)",
    },
  },
  "&:active": {
    transform: "scale(0.95)",
  },
  // Liked state styles
  "&.Mui-liked": {
    "&::before": {
      opacity: 0.15,
      transform: "scale(1)",
      backgroundColor: theme.palette.error.main,
    },
    "&:hover::before": {
      opacity: 0.25,
    },
  },
  // Focus styles for accessibility
  "&:focus-visible": {
    outline: "none",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`,
  },
});

export const likeIconStyles: SxProps<Theme> = (theme) => ({
  position: "relative",
  zIndex: 1,
  transition: theme.transitions.create(["transform", "color"], {
    duration: theme.transitions.duration.shorter,
  }),
  fontSize: theme.spacing(2.75),
  transform: "scale(1)",
  "&.Mui-liked": {
    transform: "scale(1.1)",
  },
  // Add a subtle shadow to the icon
  filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
});

export const menuIconStyles: SxProps<Theme> = (theme) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  transition: theme.transitions.create("color"),
  "&:hover": {
    color: theme.palette.text.primary,
  },
});

export const cardContentStyles: SxProps<Theme> = (theme) => ({
  flexGrow: 1,
  display: "flex",
  justifyContent: "start",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
});

export const tagsContainerStyles: SxProps<Theme> = (theme) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.spacing(0.5),
  minHeight: theme.spacing(5),
  alignItems: "start",
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(0.25),
    minHeight: theme.spacing(4),
  },
});

export const cardHeaderStyles: SxProps<Theme> = (theme) => ({
  padding: theme.spacing(2),
  "& .MuiCardHeader-avatar": {
    marginRight: theme.spacing(1),
  },
  "& .MuiCardHeader-content": {
    display: "flex",
    alignItems: "center",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    "& .MuiCardHeader-content": {
      overflow: "hidden",
    },
  },
});

export const cardActionsStyles: SxProps<Theme> = (theme) => ({
  padding: theme.spacing(1, 2, 2),
  justifyContent: "flex-start",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1, 1.5, 1.5),
  },
});

export const avatarStyles: SxProps<Theme> = (theme) => ({
  bgcolor: theme.palette.error.main,
  width: theme.spacing(4),
  height: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
  },
});

export const cardGridStyles: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
});
