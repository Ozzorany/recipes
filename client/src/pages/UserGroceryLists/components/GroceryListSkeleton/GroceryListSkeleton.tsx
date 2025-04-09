import { Box, Skeleton } from "@mui/material";
import { StyledCard } from "../../UserGroceryLists.styles";

const GroceryListSkeleton = () => {
  return (
    <StyledCard>
      <Box position="absolute" top={8} right={8}>
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
      <Box mt={2}>
        <Skeleton variant="text" width="40%" />
      </Box>
    </StyledCard>
  );
};

export default GroceryListSkeleton;
