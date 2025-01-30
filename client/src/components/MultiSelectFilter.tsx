import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { PropsWithChildren, useState } from "react";

interface MultiSelectProps {
  values: string[];
  valuesChanged: (values: string[]) => void;
}

function MultiSelectFilter(props: PropsWithChildren<MultiSelectProps>) {
  const [personName, setPersonName] = useState<string[]>([]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    const values = typeof value === "string" ? value.split(",") : value;
    setPersonName(values);
    props.valuesChanged(values);
  };

  return (
    <div>
      <FormControl
        sx={{
          background: "white",
          width: "100%",
          textAlign: "right",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      >
        <InputLabel id="demo-multiple-checkbox-label">סגנונות</InputLabel>
        <Select
          style={{ textAlign: "start" }}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="סגנונות" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {props.values.map((name) => (
            <MenuItem key={name} value={name} style={{ textAlign: "start" }}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default MultiSelectFilter;
