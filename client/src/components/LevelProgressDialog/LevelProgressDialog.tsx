import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";

export default function LevelProgressDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        sx={{ textAlign: "start" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">מתקדמים עם הדרגות</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>
              באפשרותכם להתפתח בציר המקצועי ולהגיע לדרגות חדשות.
            </Typography>
            <Typography>בכדי לעשות זאת, עליכם לעבוד קשה.</Typography>
            <br />
            <Typography>הדרגות השונות:</Typography>
            <br />
            <h5>מתמחה</h5>
            <ul>
              <li>לפרסם לפחות 2 מתכונים</li>
            </ul>
            <h5>טבח</h5>
            <ul>
              <li>לפרסם לפחות 5 מתכונים</li>
              <li>שימוש בלפחות 3 סוגי מתכונים מתוך המתכונים שפרסמתם (לדוגמה: מתכון בשרי, מתכון קינוח ומתכון בסגנון איטלקי)</li>
            </ul>
            <h5>סו שף</h5>
            <ul>
              <li>לפרסם לפחות 10 מתכונים</li>
              <li>שימוש בלפחות 5 סוגי מתכונים מתוך המתכונים שפרסמתם</li>
            </ul>
            <h5>שף</h5>
            <ul>
              <li>לפרסם לפחות 12 מתכונים</li>
              <li>שימוש בלפחות 6 סוגי מתכונים מתוך המתכונים שפרסמתם</li>
              <li>לפתוח לפחות קבוצה אחת ולהזמין אליה 2 אנשים</li>
            </ul>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
