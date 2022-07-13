import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from '@mui/material/styles';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

function IngredientsList({ ingredients }: { ingredients: string[] }) {
    return (
        <Box sx={{ flexGrow: 1, maxWidth: 752 }} >
            <Grid container spacing={2} className='d-flex justify-content-center'>
                <Grid item xs={12} md={6}>
                    <Demo>
                        <List>
                            {
                                ingredients.map(ingredient => {
                                    return (
                                        <div key={ingredient}>
                                            <ListItem>
                                                <ListItemText sx={{ color: 'black' }}
                                                    primary={ingredient}
                                                />
                                                <ListItemIcon>
                                                    <MenuBookTwoToneIcon />
                                                </ListItemIcon>
                                            </ListItem>
                                        </div>
                                    )
                                })
                            }
                        </List>
                    </Demo>
                </Grid>
            </Grid>
        </Box>
    );

}


export default IngredientsList;