import styles from "./Login.module.css"; // Import css modules stylesheet as styles
import { auth, signInWithGooglePopup } from "../../utils/firebase.utils";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    var user = auth.currentUser;

    if (user) {
      navigate("/all-recipes");
    }
    console.log(response);
  };

  return (
    <div className={styles.button}>
      <Button
        variant="contained"
        onClick={logGoogleUser}
        startIcon={<GoogleIcon />}
      >
        התחברות
      </Button>
    </div>
  );
}

export default Login;
