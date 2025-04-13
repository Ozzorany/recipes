import { Button, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useNavigate } from "react-router-dom";
import CookingAnimation from "../../../../assets/animations/CookingAnimation.json";
import {
  AnimationWrapper,
  NoResaulsWrapper,
} from "./AllRecipesEmptyState.styles";
import Lottie from "lottie-react";

const AllRecipesEmptyState = () => {
  const navigate = useNavigate();

  return (
    <AnimationWrapper>
      <NoResaulsWrapper>
        <Lottie
          animationData={CookingAnimation}
          loop
          style={{ width: "100%", height: "100%" }}
        />

        <Typography
          variant="subtitle1"
          sx={{
            color: (theme) => theme.palette.text.primary,
            mt: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          אין לכם מתכונים... רוצים להוסיף אחד?
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<RestaurantMenuIcon />}
          onClick={() => navigate("/create-recipe")}
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: "12px",
            paddingX: 4,
            paddingY: 1.5,
          }}
        >
          הוספת מתכון ראשון
        </Button>
      </NoResaulsWrapper>
    </AnimationWrapper>
  );
};

export default AllRecipesEmptyState;
