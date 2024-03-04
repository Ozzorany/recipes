import { Typography } from "@mui/material";

function Level({ level }: { level: number }) {
  let text = '';

  switch (level) {
    case 0:
      text = 'חסר דרגה';
      break;
    case 1:
      text = 'מתמחה';
      break;
    case 2:
      text = 'טבח';
      break;
    case 3:
      text = 'סו שף';
      break;
    case 4:
      text = 'שף';
      break;
    default:
      text = 'חסר דרגה';
      break;
  }

  return <Typography>{text}</Typography>;
}

export default Level;
