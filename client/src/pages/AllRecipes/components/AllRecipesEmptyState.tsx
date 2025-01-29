import { Typography } from "@mui/material";
import CookingAnimation from "../../../assets/animations/CookingAnimation.json";

import {
  AnimationWrapper,
  NoResaulsWrapper,
} from "./AllRecipesEmptyState.styles";
import Lottie from "lottie-react";

const AllRecipesEmptyState = () => {
  return (
    <AnimationWrapper>
      <NoResaulsWrapper>
        <Lottie
          animationData={CookingAnimation}
          loop={true}
          style={{ width: "100%", height: "100%" }}
        />
        <Typography
          style={{
            color: "white",
          }}
          variant="h5"
        >
          אין לכם מתכונים
        </Typography>
      </NoResaulsWrapper>
    </AnimationWrapper>
  );
};

export default AllRecipesEmptyState;
