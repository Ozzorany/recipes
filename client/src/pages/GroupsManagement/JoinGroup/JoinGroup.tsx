import { useEffect } from "react";
import styles from "./JoinGroup.module.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useJoinGroup } from "../../../queries/mutations/useJoinGroup";
import { CircularProgress } from "@mui/material";

export default function JoinGroup() {
  const [searchParams] = useSearchParams();
  const groupName = searchParams.get("groupName");
  const token = searchParams.get("token") || "";
  const {
    mutate: joinGroupMutation,
    isPending,
    isError,
    data: responseData,
  } = useJoinGroup();
  const { data: isSuccess } = responseData || {};
  const navigate = useNavigate();

  const acceptInvitation = () => {
    joinGroupMutation(token);
  };

  const handleOtherTime = () => {
    navigate("/all-recipes", { replace: true });
  };

  const handledJoinedGroup = () => {
    navigate("/groups-management", { replace: true });
  };

  useEffect(() => {
    if (isSuccess) {
      const timeoutId = setTimeout(() => {
        navigate("/groups-management", { replace: true });
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
            {`הצטרפות לקבוצת ${groupName}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isError
              ? "אוי לא, יש בעיה עם ההזמנה שקיבלתם. אולי פג תוקפה. נסו לבקש הזמנה חדשה."
              : "קיבלתם הזדמנות להצטרף לקבוצה, איזה כיף לכם! אתם בטוחים שתרצו לקבל את ההזמנה?"}
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
              <Button size="small" onClick={handledJoinedGroup}>
                הצטרפתם לקבוצה!
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </div>
  );
}
