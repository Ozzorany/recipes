// components/HealthCheckWrapper.tsx
import React from "react";
import { useHealthCheck } from "../../queries/useHealthCheck ";
import FoodAnimation from "../../assets/animations/FoodAnimation.json";
import Lottie from "lottie-react";
import Typography from "@mui/material/Typography";


interface HealthCheckWrapperProps {
  children: React.ReactNode;
}

const HealthCheckWrapper: React.FC<HealthCheckWrapperProps> = ({ children }) => {
  const { isLoading, isError, isSuccess } = useHealthCheck();

  if (isLoading || isError) {
    // Display loader or fallback UI when the server is unavailable
    return (
        <div style={{ width: "50%", height: "100vh", maxWidth: 300, margin: "auto" }}>
        <Lottie
          animationData={FoodAnimation}
          loop={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  // Render the app when the server is healthy
  if (isSuccess) {
    return <>{children}</>;
  }

  return null; // This shouldn't happen but is a fallback
};

export default HealthCheckWrapper;
