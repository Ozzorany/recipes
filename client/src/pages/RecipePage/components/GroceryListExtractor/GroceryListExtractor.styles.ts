import { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
  listItem: {
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
    py: 1.5,
    borderRadius: 2,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    backgroundColor: "#fdfdfd",
    mb: 1,
    flexWrap: "wrap",
    rowGap: 1,
    "@media (max-width:600px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      px: 1.5,
    },
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    flex: 1,
    "@media (max-width:600px)": {
      width: "100%",
    },
  },
  itemText: {
    textAlign: "start",
  },
  amountControl: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    border: "1px solid",
    borderColor: "grey.300",
    borderRadius: "999px",
    px: 1.5,
    py: 0.5,
    backgroundColor: "white",
    "@media (max-width:600px)": {
      alignSelf: "flex-end",
    },
  },
  amountNumber: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: 500,
  },
  extractButtonWrapper: {
    mb: 2,
    display: "flex",
    justifyContent: "flex-start",
  },
  checkboxLabel: {
    textAlign: "start",
    justifyContent: "flex-start",
    display: "flex",
  },
  selectInput: {
    mt: 1,
    "& .MuiSelect-select": {
      textAlign: "right",
      display: "flex",
      justifyContent: "flex-start",
    },
  },
};
