import { Box, debounce, TextField, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { AllRecipesFiltersProps } from "./AllRecipesFilters.types";
import FilterIcon from "../FilterIcon/FilterIcon";

const AllRecipesFilters = ({
  setValue,
  setFilterTags,
  filterTags,
  ownershipFilter,
  setOwnershipFilter,
}: AllRecipesFiltersProps) => {
  const matches = useMediaQuery("(min-width:600px)");
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const debouncedChangeHandler = useMemo(() => debounce(changeValue, 100), []);

  return (
    <div style={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          m: 1,
          borderRadius: 1,
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            flex: 1,
            marginRight: 2,
          }}
        >
          <TextField
            id="outlined-multiline-flexible"
            label="חיפוש..."
            onChange={debouncedChangeHandler}
            sx={{
              background: "white",
              width: "100%",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        </Box>
        <FilterIcon
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          ownershipFilter={ownershipFilter}
          onOwnershipFilterChange={setOwnershipFilter}
        />
      </Box>
    </div>
  );
};

export default AllRecipesFilters;
