import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Checkbox, Chip, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import { red } from '@mui/material/colors';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import useRecipes from '../hooks/useRecipes';


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard({ recipe }: any) {
  const [expanded, setExpanded] = React.useState(false);
  const { deleteRecipe } = useRecipes();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDeleteRecipe = (popupState: any) => {
    popupState.close();
    deleteRecipe(recipe.id);
  }

  return (
    <Card sx={{width: '100%'}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <IconButton aria-label="settings" {...bindTrigger(popupState)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={() => handleDeleteRecipe(popupState)}>מחיקה</MenuItem>
                  <MenuItem onClick={popupState.close}>עריכה</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
          
        }
        title={recipe.description}
        subheader="September 14, 2016"
      />
      <CardMedia
        component="img"
        height="194"
        image="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2022%2F03%2F20%2F20334-Banana-Pancakes-mfs__2x3.jpg"
        alt={recipe.description}
      />

      { !!recipe.ingredients.length &&
      <Paper style={{maxHeight: 200, overflow: 'auto'}}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {recipe.ingredients?.map((value: any) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem
                key={value}
                disablePadding
              >
                <ListItemButton role={undefined} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText style={{ textAlign: 'right' }} id={labelId} primary={`${value}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        </Paper>
      }


      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        {
          recipe.tags.map((tag: any) => {
            return (
              <Stack direction="row"
                key={tag}
                spacing={1}>
                <Chip label={tag} />
              </Stack>
            )
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
          <Typography paragraph>:אופן ההכנה</Typography>
          <Typography paragraph sx={{wordWrap: 'break-word'}}>
           {recipe.method}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>

  );
}
