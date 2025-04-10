import React from "react";
import { Skeleton, List, ListItem, ListItemText, Divider } from "@mui/material";

const GroceryListSkeleton = () => {
  return (
    <List>
      {[...Array(5)].map((_, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <Skeleton variant="circular" width={40} height={40} />
            <ListItemText
              primary={<Skeleton variant="text" />}
              sx={{ ml: 2 }}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default GroceryListSkeleton;
