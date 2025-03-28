import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
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
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import noImagePath from "../../assets/images/recipe-book.jpg";
import styles from "./RecipeReviewCard.module.css"; // Import css modules stylesheet as styles
import { useUserById } from "../../queries/useUserById";
import { Recipe } from "../../models/recipe.model";
import { auth } from "../../utils/firebase.utils";
import { useRecipeLikesMutation } from "../../queries/mutations/useRecipeLikesMutation";
import { useDeleteRecipe } from "../../queries/mutations/useDeleteRecipe";

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

export default function RecipeReviewCard({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = React.useState(false);
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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
    <Card sx={{ width: "100%" }}>
      <CardHeader
        avatar={
          <>
            <Box display="flex" alignItems="center">
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
                        separator=":"
                      >
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </ListItemIcon>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        }
        title={
          <Typography className={styles.recipeTitle}>
            {recipe.description}
          </Typography>
        }
      />
      <CardMedia
        sx={{
          height: 250,
          width: "100%",
          objectFit: recipe.image ? "cover" : "contain",
          borderRadius: "10px",
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
          {recipeLikes?.length > 0 && (
            <Typography>{recipeLikes?.length}</Typography>
          )}
          <IconButton
            aria-label="like"
            onClick={handleLike}
            sx={{ outline: "none !important" }}
          >
            <FavoriteIcon
              style={{ color: recipeLikes?.includes(userId) ? "red" : "gray" }}
            />
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
