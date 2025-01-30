import {
  Box,
  debounce,
  IconButton,
  TextField,
  useMediaQuery,
} from "@mui/material";
import GradeIcon from "@mui/icons-material/Grade";
import MultiSelectFilter from "../../../../components/MultiSelectFilter";

import { useMemo } from "react";
import { foodCategories } from "../../../../constants";
import { AllRecipesFiltersProps } from "./AllRecipesFilters.types";

const AllRecipesFilters = ({
  setValue,
  setFilterTags,
  showFavoritesOnly,
  setShowFavoritesOnly,
}: AllRecipesFiltersProps) => {
  const matches = useMediaQuery("(min-width:600px)");
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const debouncedChangeHandler = useMemo(() => debounce(changeValue, 100), []);

  const handleFilterTagsChanged = (tags: string[]) => {
    setFilterTags(tags);
  };

  const toggleShowFavoritesOnly = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  return (
    <div style={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          p: 1,
          m: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ width: `${matches ? "15%" : "100%"}` }}
        >
          <TextField
            id="outlined-multiline-flexible"
            label="חיפוש..."
            onChange={debouncedChangeHandler}
            sx={{ background: "white", width: "100%" }}
          />
        </Box>

        <div className="mr-2" style={{ width: `${matches ? "15%" : "100%"}` }}>
          <MultiSelectFilter
            values={foodCategories}
            valuesChanged={handleFilterTagsChanged}
          />
        </div>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            width: `${matches ? "15%" : "100%"}`,
            alignItems: "center",
            display: "flex",
            marginLeft: "16px",
          }}
        >
          <IconButton
            aria-label="add to favorites"
            onClick={toggleShowFavoritesOnly}
          >
            <GradeIcon
              style={{ color: showFavoritesOnly ? "#f0dd5a" : "gray" }}
              fontSize="large"
            />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default AllRecipesFilters;
