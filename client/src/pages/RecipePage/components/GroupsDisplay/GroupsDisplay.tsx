import { useState, useEffect, useRef } from "react";
import { Tooltip, Fade, useTheme, Box, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { RecipeGroupProps } from "../../../../models/groups.model";
import { GroupsContainer, GroupChip } from "./GroupsDisplay.styles";

interface GroupsDisplayProps {
  groups: RecipeGroupProps[];
}

function GroupsDisplay({ groups }: GroupsDisplayProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!groups?.length) return null;

  const visibleGroups = groups.slice(0, 2);
  const hasMoreGroups = groups.length > 2;
  const remainingGroups = groups.slice(2);

  const getTooltipContent = () => {
    return (
      <Box sx={{ p: 1, bgcolor: "white", borderRadius: 1 }}>
        {remainingGroups.map((group) => (
          <Box key={group.id} sx={{ mb: 0.5, color: "text.primary" }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {group.name}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <GroupsContainer>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {visibleGroups.map((group) => (
          <Tooltip
            key={group.id}
            title={`Shared with ${group.name}`}
            arrow
            slots={{ transition: Fade }}
          >
            <GroupChip
              icon={<GroupIcon />}
              label={group.name}
              size="small"
              sx={{
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
                maxWidth: "200px",
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            />
          </Tooltip>
        ))}
        {hasMoreGroups && (
          <div ref={tooltipRef}>
            <Tooltip
              title={getTooltipContent()}
              arrow
              slots={{ transition: Fade }}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              slotProps={{
                popper: {
                  disablePortal: true,
                  sx: {
                    "& .MuiTooltip-tooltip": {
                      bgcolor: "white",
                      color: "text.primary",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    },
                    "& .MuiTooltip-arrow": {
                      color: "white",
                    },
                  },
                },
              }}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <GroupChip
                label={`+${remainingGroups.length}`}
                size="small"
                onClick={() => setOpen(!open)}
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.light,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.main,
                  },
                }}
              />
            </Tooltip>
          </div>
        )}
      </Box>
    </GroupsContainer>
  );
}

export default GroupsDisplay;
