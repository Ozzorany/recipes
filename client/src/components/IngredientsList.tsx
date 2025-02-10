import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { Fragment } from "react";
import { Ingredient } from "../models/ingredient.model";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function IngredientsList({
  ingredients,
  removeIngredient,
}: {
  ingredients: Ingredient[];
  removeIngredient: (ingredient: Ingredient) => void;
}) {
  const emmitRemoveIngredient = (ingredient: Ingredient): void => {
    removeIngredient(ingredient);
  };

  return (
    <Box sx={{ flexGrow: 1, maxHeight: 200, overflow: "auto" }}>
      <Grid
        container
        spacing={2}
        className="d-flex justify-content-center mr-0"
        style={{ width: "100%" }}
      >
        <Grid sx={{ pr: 0 }}>
          <Demo>
            <List>
              {ingredients.map((ingredient) => {
                return (
                  <div key={ingredient.id}>
                    <ListItem>
                      <ListItemText
                        sx={{ color: "black" }}
                        primary={
                          <Fragment>
                            <div className="d-flex justify-context-center">
                              <DeleteTwoToneIcon
                                sx={{ cursor: "pointer" }}
                                onClick={() =>
                                  emmitRemoveIngredient(ingredient)
                                }
                              />
                              <span
                                style={{
                                  marginRight: "0.5rem",
                                  wordBreak: "break-word",
                                }}
                              >
                                {ingredient.description}
                              </span>
                            </div>
                          </Fragment>
                        }
                      />
                      <ListItemIcon style={{ direction: "ltr" }}>
                        <MenuBookTwoToneIcon />
                      </ListItemIcon>
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </Demo>
        </Grid>
      </Grid>
    </Box>
  );
}

export default IngredientsList;
