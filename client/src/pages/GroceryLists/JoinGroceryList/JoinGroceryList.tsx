import { useEffect } from "react";
import styles from "./JoinGroceryList.module.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useJoinGroceryList } from "../../../queries/mutations/useJoinGroceryList";
import { CircularProgress } from "@mui/material";

export default function JoinGroceryList() {
  const [searchParams] = useSearchParams();
  const listName = searchParams.get("listName");
  const token = searchParams.get("token") || "";
  const {
    mutate: joinGroceryListMutation,
    isPending,
    isError,
    data: responseData,
  } = useJoinGroceryList();
  const { data: isSuccess } = responseData || {};
  const navigate = useNavigate();

  const acceptInvitation = () => {
    joinGroceryListMutation(token);
  };

  const handleOtherTime = () => {
    navigate("/grocery-lists", { replace: true });
  };

  const handleJoinedList = () => {
    navigate("/grocery-lists", { replace: true });
  };

  useEffect(() => {
    if (isSuccess) {
      const timeoutId = setTimeout(() => {
        navigate("/grocery-lists", { replace: true });
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [isSuccess]);

  return (
    <div className={styles.wrapper}>
      <Card sx={{ maxWidth: 310, marginTop: "24px" }}>
        <CardContent>
          <Typography
            gutterBottom
            component="div"
            sx={{ fontSize: "18px", fontWeight: 400 }}
          >
            {`הצטרפות לרשימת ${listName}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isError
              ? "אוי לא, יש בעיה עם ההזמנה שקיבלתם. אולי פג תוקפה. נסו לבקש הזמנה חדשה."
              : "קיבלתם הזדמנות להצטרף לרשימת קניות, איזה כיף לכם! אתם בטוחים שתרצו לקבל את ההזמנה?"}
          </Typography>
        </CardContent>
        {!isError && (
          <CardActions>
            {isPending && <CircularProgress size={25} />}
            {!isPending && !isSuccess && (
              <Button
                size="small"
                onClick={acceptInvitation}
                disabled={isPending}
              >
                ברור
              </Button>
            )}

            {!isPending && responseData === undefined && (
              <Button size="small" onClick={handleOtherTime}>
                אולי בפעם אחרת
              </Button>
            )}
            {isSuccess && (
              <Button size="small" onClick={handleJoinedList}>
                הצטרפתם לרשימה!
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </div>
  );
}
