import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      bgColor: "white",
    },
  },
};

export default function MultiSelect({
  values,
  currentValues,
  submitValuesChange,
}: {
  values: any;
  currentValues: any;
  submitValuesChange: (values: string[]) => void;
}) {
  const [groupsName, setGroupsName] = React.useState<string[]>([]);

  React.useEffect(() => {
    const idsInValues = values;

    const filteredNames = idsInValues
      ?.filter((obj: { id: any }) => currentValues?.includes(obj.id))
      ?.map((obj: { name: any }) => obj.name);

    if (filteredNames?.length > 0) {
      setGroupsName(filteredNames);
    }
  }, [values, currentValues]);

  const handleChange = (event: SelectChangeEvent<typeof groupsName>) => {
    const {
      target: { value },
    } = event;
    const groups = typeof value === "string" ? value.split(",") : value;
    setGroupsName(groups);

    // change to do with ID!
    const groupsIds = values
      ?.filter((value: { name: string }) => groups?.includes(value?.name))
      ?.map((value: { id: any; }) => value.id);
    submitValuesChange(groupsIds);
  };

  return (
    <div>
      <FormControl
        sx={{ m: 1, width: 300 }}
        style={{ backgroundColor: "white" }}
      >
        <InputLabel dir="rtl" id="demo-multiple-checkbox-label">
          קבוצות משותפות
        </InputLabel>
        <Select
          dir="rtl"
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={groupsName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {values?.map((value: any) => (
            <MenuItem key={value.id} value={value.name}>
              <Checkbox checked={groupsName.indexOf(value.name) > -1} />
              <ListItemText primary={value.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
