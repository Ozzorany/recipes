import { Card, CardContent, Typography } from "@mui/material";

import { EmptyStateWrapper } from "./RecipePageEmptyState.styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const RecipePageEmptyState = () => {
  return (
    <EmptyStateWrapper>
      <Card sx={{ maxWidth: 310, marginTop: "24px" }}>
        <CardContent>
          <ErrorOutlineIcon />
          <Typography
            gutterBottom
            component="div"
            sx={{ fontSize: "18px", fontWeight: 400 }}
          >
            אין אפשרות לצפות במתכון
          </Typography>
          <Typography variant="body2" color="text.secondary">
            יכול להיות שהמתכון שאתם מחפשים נמחק, או שאתם לא נמצאים בקבוצה שבה
            הוא משותף.
          </Typography>
        </CardContent>
      </Card>
    </EmptyStateWrapper>
  );
};

export default RecipePageEmptyState;
