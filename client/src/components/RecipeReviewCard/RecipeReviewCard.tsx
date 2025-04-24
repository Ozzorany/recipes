import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Chip, Menu, MenuItem, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import noImagePath from "../../assets/images/recipe-book.jpg";
import styles from "./RecipeReviewCard.module.css";
import { useUserById } from "../../queries/useUserById";
import { Recipe } from "../../models/recipe.model";
import { auth } from "../../utils/firebase.utils";
import { useRecipeLikesMutation } from "../../queries/mutations/useRecipeLikesMutation";
import { useDeleteRecipe } from "../../queries/mutations/useDeleteRecipe";
import {
  cardStyles,
  titleStyles,
  mediaStyles,
  tagStyles,
  likeButtonStyles,
  likeIconStyles,
  menuIconStyles,
  cardContentStyles,
  tagsContainerStyles,
} from "./RecipeReviewCard.styles";

export default function RecipeReviewCard({ recipe }: { recipe: Recipe }) {
  const [recipeLikes, setRecipeLikes] = React.useState<string[]>([]);
  const navigate = useNavigate();
  const { mutate: mutateRecipeLike } = useRecipeLikesMutation();
  const { data: user } = useUserById(recipe?.creatorId);
  const userLogoUrl = user?.logo;
  const currentLogedInUser = auth.currentUser;
  const userId = auth?.currentUser?.uid || "";
  const { likes = [] } = recipe || {};
  const firstRender = useRef(true);
  const { mutate: deletRecipeMutation } = useDeleteRecipe();

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setRecipeLikes(likes);
    }
  }, [likes]);

  const handleDeleteRecipe = (popupState: any) => {
    popupState.close();
    deletRecipeMutation(recipe.id);
  };

  const handleEditRecipe = (popupState: any) => {
    popupState.close();
    navigate("/edit-recipe", { state: { isEdit: true, recipe: recipe } });
  };

  const navigateToRecipePage = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleLike = () => {
    mutateRecipeLike(recipe.id);
    const likes = recipeLikes;

    const index = likes?.indexOf(userId);
    if (index !== -1) {
      likes?.splice(index, 1);
    } else {
      likes?.push(userId);
    }

    setRecipeLikes(likes);
  };

  return (
    <Card sx={cardStyles}>
      <CardHeader
        avatar={
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{ bgcolor: red[500] }}
              aria-label="recipe"
              src={userLogoUrl}
              imgProps={{ referrerPolicy: "no-referrer" }}
            />
          </Box>
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
                      <ModeEditOutlineOutlinedIcon sx={menuIconStyles} />
                      <Typography textAlign="left">עריכה</Typography>
                    </MenuItem>
                  )}

                  {currentLogedInUser?.uid === recipe?.creatorId && (
                    <MenuItem onClick={() => handleDeleteRecipe(popupState)}>
                      <DeleteOutlineOutlinedIcon sx={menuIconStyles} />
                      <Typography textAlign="left">מחיקה</Typography>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <WhatsappShareButton
                      url={`https://recipes-e6692.web.app/recipe/${recipe.id}`}
                      title={recipe.description}
                      separator=":"
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        }
        title={
          <Typography
            className={styles.recipeTitle}
            sx={titleStyles}
            onClick={navigateToRecipePage}
          >
            {recipe.description}
          </Typography>
        }
      />
      <Box sx={mediaStyles}>
        <img
          src={!!recipe.image ? recipe.image : noImagePath}
          alt={recipe.description}
          onClick={navigateToRecipePage}
        />
      </Box>

      <CardContent sx={cardContentStyles}>
        <Stack sx={tagsContainerStyles}>
          {recipe.tags.map((tag: string) => (
            <Chip key={tag} label={tag} size="small" sx={tagStyles} />
          ))}
        </Stack>
      </CardContent>

      <CardActions disableSpacing>
        <Box display="flex" alignItems="center" gap={1}>
          {recipeLikes?.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {recipeLikes?.length}
            </Typography>
          )}
          <IconButton
            aria-label="like"
            onClick={handleLike}
            sx={likeButtonStyles}
          >
            <FavoriteIcon
              style={{
                ...likeIconStyles,
                color: recipeLikes?.includes(userId) ? "red" : "gray",
              }}
            />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}
