import { Typography } from "@mui/material";
import styles from "./Level.module.css"; // Import css modules stylesheet as styles
import clsx from "clsx";


function Level({ level }: { level: number }) {
  let text = "";
  let style = "zero";

  switch (level) {
    case 0:
      text = "חסר דרגה";
      style = "zero"
      break;
    case 1:
      text = "מתמחה";
      style = "one"
      break;
    case 2:
      text = "טבח";
      style = "two"
      break;
    case 3:
      text = "סו שף";
      style = "three"
      break;
    case 4:
      text = "שף";
      style = "four"
      break;
    default:
      text = "חסר דרגה";
      style = "zero"
      break;
  }

  return (
    <div className={clsx(styles.wrapper, styles[style])}>
      <Typography className={styles.text}>{text}</Typography>
    </div>
  );
}

export default Level;
