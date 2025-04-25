import { SxProps, Theme } from "@mui/material";

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    height: "100%",
    overflow: "hidden",
  } as SxProps<Theme>,
  recipePaper: {
    p: 2,
    width: "100%",
    textAlign: "left",
    flex: 1,
    overflow: "auto",
  } as SxProps<Theme>,
  commentsContainer: {
    display: "flex",
    gap: 1,
    alignItems: "center",
    width: "100%",
    mt: 2,
  } as SxProps<Theme>,
  commentsInput: {
    flex: 1,
    "& .MuiInputBase-root": {
      height: "50px",
    },
  } as SxProps<Theme>,
  regenerateButton: {
    height: "40px",
    width: "40px",
    minWidth: "40px",
    p: 0,
    borderRadius: "8px",
    flexShrink: 0,
  } as SxProps<Theme>,
};

export default styles;
