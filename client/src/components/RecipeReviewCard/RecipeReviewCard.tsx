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
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import noImagePath from "../../assets/images/recipe-book.png";
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
  noImageStyles,
  tagStyles,
  likeButtonStyles,
  likeIconStyles,
  menuIconStyles,
  cardContentStyles,
  tagsContainerStyles,
  cardHeaderStyles,
  cardActionsStyles,
  avatarStyles,
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
        sx={cardHeaderStyles}
        avatar={
          <Box display="flex" alignItems="center">
            <Avatar
              sx={avatarStyles}
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
      <Box
        sx={!recipe.image ? noImageStyles : mediaStyles}
        onClick={navigateToRecipePage}
        role="button"
        tabIndex={0}
        aria-label={`View recipe: ${recipe.description}`}
      >
        <img
          src={!!recipe.image ? recipe.image : noImagePath}
          alt={recipe.description}
          loading="lazy"
        />
      </Box>

      <CardContent sx={cardContentStyles}>
        <Stack sx={tagsContainerStyles}>
          {recipe.tags.map((tag: string) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={tagStyles}
              aria-label={`Recipe tag: ${tag}`}
            />
          ))}
        </Stack>
      </CardContent>

      <CardActions disableSpacing sx={cardActionsStyles}>
        <Box display="flex" alignItems="center" gap={1}>
          {recipeLikes?.length > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              aria-label={`${recipeLikes.length} likes`}
            >
              {recipeLikes?.length}
            </Typography>
          )}
          <IconButton
            aria-label={
              recipeLikes?.includes(userId) ? "Unlike recipe" : "Like recipe"
            }
            onClick={handleLike}
            sx={likeButtonStyles}
            className={recipeLikes?.includes(userId) ? "Mui-liked" : ""}
          >
            <FavoriteIcon
              sx={{
                ...likeIconStyles,
                color: (theme) =>
                  recipeLikes?.includes(userId)
                    ? theme.palette.error.main
                    : theme.palette.grey[500],
              }}
            />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}
