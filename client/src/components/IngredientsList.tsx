import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ListItemText from "@mui/material/ListItemText";
import { styled } from '@mui/material/styles';
import { Fragment } from 'react';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

function IngredientsList({ ingredients }: { ingredients: string[] }) {
    return (
        <Box sx={{ flexGrow: 1, maxHeight: 200, overflow: 'auto' }}>
            <Grid container spacing={2} className='d-flex justify-content-center mr-0' style={{width: '100%'}}>
                <Grid item xs md className='pr-0'>
                    <Demo>
                        <List>
                            {
                                ingredients.map(ingredient => {
                                    return (
                                        <div key={ingredient}>
                                            <ListItem>
                                                <ListItemText sx={{ color: 'black' }}
                                                    primary={<Fragment>
                                                        <div className='d-flex justify-context-center'>
                                                        <DeleteTwoToneIcon/>
                                                        <span style={{marginRight: '0.5rem'}}>{ingredient}</span>                                                    
                                                        </div>
                                                        </Fragment>}
                                                />
                                                <ListItemIcon style={{direction: 'ltr'}}>
                                                    <MenuBookTwoToneIcon/>
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