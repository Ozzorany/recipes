import styles from "./Login.module.css"; // Import css modules stylesheet as styles
import {
  additionalUserInfo,
  auth,
  signInWithGooglePopup,
} from "../../utils/firebase.utils";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../../queries/useCreateUser";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const useCreateUserMutation = useCreateUser();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/all-recipes");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    var user = auth.currentUser;

    if (additionalUserInfo(response)?.isNewUser) {
      useCreateUserMutation.mutate({
        id: user?.uid!,
        displayName: user?.displayName!,
        email: user?.email!,
        logo: user?.photoURL!,
        managedGroups: [],
        sharedGroups: [],
        favoriteRecipes: [],
      });
    } else {
      console.log("existing");
    }

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
