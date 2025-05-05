import {
  IconButton,
  Popover,
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Button,
  Badge,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";
import MultiSelectFilter from "../../../../components/MultiSelectFilter";
import { foodCategories } from "../../../../constants";
import { auth } from "../../../../utils/firebase.utils";
import ClearAllIcon from "@mui/icons-material/ClearAll";

interface FilterIconProps {
  filterTags: string[];
  setFilterTags: (tags: string[]) => void;
  onOwnershipFilterChange: (filter: "all" | "owned" | "not-owned") => void;
  ownershipFilter: "all" | "owned" | "not-owned";
}

const FilterIcon = ({
  filterTags,
  setFilterTags,
  onOwnershipFilterChange,
  ownershipFilter,
}: FilterIconProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleFilterTagsChanged = (tags: string[]) => {
    setFilterTags(tags);
  };

  const handleClearAll = () => {
    setFilterTags([]);
    onOwnershipFilterChange("all");
  };

  const hasActiveFilters = filterTags.length > 0 || ownershipFilter !== "all";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          color: hasActiveFilters ? "primary.main" : "inherit",
        }}
      >
        <Badge variant="dot" color="primary" invisible={!hasActiveFilters}>
          <FilterListIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            p: 2,
            minWidth: 250,
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
          }}
        >
          {hasActiveFilters && (
            <>
              <Button
                startIcon={<ClearAllIcon />}
                onClick={handleClearAll}
                sx={{ mb: 2 }}
                size="small"
              >
                נקו הכל
              </Button>
              <Divider sx={{ mb: 2 }} />
            </>
          )}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            סגנונות מתכונים
          </Typography>
          <MultiSelectFilter
            values={foodCategories}
            valuesChanged={handleFilterTagsChanged}
            selectedValues={filterTags}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            של מי המתכון?
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ownershipFilter === "all"}
                  onChange={() => onOwnershipFilterChange("all")}
                />
              }
              label="הכל"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ownershipFilter === "owned"}
                  onChange={() => onOwnershipFilterChange("owned")}
                />
              }
              label="המתכונים שלי"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ownershipFilter === "not-owned"}
                  onChange={() => onOwnershipFilterChange("not-owned")}
                />
              }
              label="מתכונים של אחרים"
            />
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FilterIcon;
