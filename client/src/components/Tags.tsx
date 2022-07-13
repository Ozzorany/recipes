import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      bgColor: 'white',
    },
  },
};

const names = [
  'איטלקי',
  'קינוח',
  'חלבי',
  'בשרי'
];

function Tags({ submitTagsChange }: { submitTagsChange: (tags: string[]) => void }) {
    const [tags, setTags] = useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof tags>) => {
      const {target: { value }} = event;
      const newTags: string[] = typeof value === 'string' ? value.split(',') : value;
      setTags(newTags);
      submitTagsChange(newTags);
    };
    
    return (
        <div>
          <FormControl sx={{ m: 1, width: 300 }} style={{backgroundColor: 'white'}}>
            <InputLabel id="demo-multiple-checkbox-label" dir="rtl">סגנונות</InputLabel>
            <Select
            dir="rtl"
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={tags}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={tags.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      );

}

export default Tags;