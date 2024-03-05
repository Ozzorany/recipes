import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GradeIcon from "@mui/icons-material/Grade";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import { useAppDispatch } from "../../hooks/storeHooks";
import { deleteRecipe } from "../../state/recipesSlice";
import noImagePath from "../../assets/images/recipe-book.jpg";
import styles from "./RecipeReviewCard.module.css"; // Import css modules stylesheet as styles
import { useUserById } from "../../queries/useUserById";
import { Recipe } from "../../models/recipe.model";
import { auth } from "../../utils/firebase.utils";
import { useFavoriteRecipesMutation } from "../../queries/mutations/useFavoriteRecipesMutation";
import { useRecipeLikesMutation } from "../../queries/mutations/useRecipeLikesMutation";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

type HandleFavoritse = (recipeId: string) => void;

export default function RecipeReviewCard({
  recipe,
  isFavorite,
  handleFavoriteRecipesChange,
}: {
  recipe: Recipe;
  isFavorite: boolean;
  handleFavoriteRecipesChange: HandleFavoritse;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [like, setLike] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const favoriteRecipesMutation = useFavoriteRecipesMutation();
  const { mutate: mutateRecipeLike } = useRecipeLikesMutation();
  const { data: user } = useUserById(recipe?.creatorId);
  const userLogoUrl = user?.logo;
  const currentLogedInUser = auth.currentUser;
  const { likes } = recipe || {};

  useEffect(() => {
    if (likes?.includes(user?.id)) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [likes]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDeleteRecipe = (popupState: any) => {
    popupState.close();
    dispatch(deleteRecipe(recipe.id));
  };

  const handleEditRecipe = (popupState: any) => {
    popupState.close();
    navigate("/edit-recipe", { state: { isEdit: true, recipe: recipe } });
  };

  const navigateToRecipePage = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleFavorite = () => {
    favoriteRecipesMutation.mutate(recipe.id);
    handleFavoriteRecipesChange(recipe.id);
  };

  const handleLike = () => {
    setLike((prevState: boolean) => !prevState);
    mutateRecipeLike(recipe.id);

    const index = likes?.indexOf(user.id);
    if (index !== -1) {
      likes?.splice(index, 1);
    } else {
      likes?.push(user.id);
    }
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        avatar={
          <>
            <Box display="flex" alignItems="center">
              <IconButton
                sx={{ outline: "none !important" }}
                aria-label="add to favorites"
                onClick={handleFavorite}
              >
                <GradeIcon
                  sx={{
                    color: isFavorite ? "#f0dd5a" : "gray",
                    fontSize: "40px",
                  }}
                />
              </IconButton>
              <Avatar
                sx={{ bgcolor: red[500] }}
                aria-label="recipe"
                src={userLogoUrl}
                imgProps={{ referrerPolicy: "no-referrer" }}
              />
            </Box>
          </>
        }
        action={
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <IconButton aria-label="settings" {...bindTrigger(popupState)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu {...bindMenu(popupState)}>
                  {currentLogedInUser?.uid === recipe?.creatorId && (
                    <MenuItem
                      onClick={() => handleEditRecipe(popupState)}
                      className={styles.item}
                    >
                      <ListItemIcon>
                        <ModeEditOutlineOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography textAlign="left">עריכה</Typography>
                      </ListItemText>
                    </MenuItem>
                  )}

                  {currentLogedInUser?.uid === recipe?.creatorId && (
                    <MenuItem onClick={() => handleDeleteRecipe(popupState)}>
                      <ListItemIcon>
                        <DeleteOutlineOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography textAlign="left">מחיקה</Typography>
                      </ListItemText>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <ListItemIcon>
                      <WhatsappShareButton
                        url={`https://recipes-e6692.web.app/recipe/${recipe.id}`}
                        title={recipe.description}
                        separator=":: "
                      >
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </ListItemIcon>
                    <ListItemText sx={{ marginLeft: "2px" }}>
                      <Typography textAlign="left">שיתוף מתכון</Typography>
                    </ListItemText>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        }
        title={recipe.description}
      />
      <CardMedia
        style={{
          width: "auto",
          height: "31vh",
          margin: "auto",
          cursor: "pointer",
        }}
        component="img"
        image={!!recipe.image ? recipe.image : noImagePath}
        alt={recipe.description}
        onClick={navigateToRecipePage}
      />

      {!!recipe.ingredients.length && (
        <Paper style={{ maxHeight: 200, overflow: "auto" }}>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {recipe.ingredients?.map((value: any, index: number) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={index} disablePadding>
                  <ListItemButton role={undefined} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      style={{ textAlign: "right" }}
                      id={labelId}
                      primary={`${value}`}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}

      <CardActions disableSpacing>
        <Box display="flex" alignItems="center">
          {likes?.length > 0 && <Typography>{likes?.length}</Typography>}
          <IconButton
            aria-label="like"
            onClick={handleLike}
            sx={{ outline: "none !important" }}
          >
            <FavoriteIcon style={{ color: like ? "red" : "gray" }} />
          </IconButton>
        </Box>

        {recipe.tags.map((tag: any) => {
          return (
            <Stack direction="row" key={tag} spacing={1}>
              <Chip label={tag} />
            </Stack>
          );
        })}

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph sx={{ direction: "rtl" }}>
            :אופן ההכנה
          </Typography>
          <Typography
            paragraph
            sx={{
              wordWrap: "break-word",
              whiteSpace: "break-spaces",
              textAlign: "left",
            }}
          >
            {recipe.method}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
