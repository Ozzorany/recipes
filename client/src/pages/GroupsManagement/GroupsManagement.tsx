import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import { Badge, Snackbar } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { BadgeProps } from "react-bootstrap";
import { useGroupsManagement } from "../../queries/useGroupsManagement";
import styles from "./GroupsManagement.module.css"; // Import css modules stylesheet as styles
import AddIcon from "@mui/icons-material/Add";
import { useGenerateInvitationGroupLink } from "../../queries/mutations/useGenerateInvitationGroupLink";
import { isCallChain } from "typescript";

interface GroupState {
  [key: string]: boolean;
}

export default function GroupsManagement() {
  const [open, setOpen] = React.useState<GroupState>({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const { data: userGroups } = useGroupsManagement();
  const managedGroups = userGroups?.managedGroups || [];
  const sharedGroups = userGroups?.sharedGroups || [];
  const {
    mutate: generateLinkMutation,
    isPending,
    data: responseData,
  } = useGenerateInvitationGroupLink();
  const { data: generatedLink } = responseData || {};

  React.useEffect(() => {
    if (!isPending && !!responseData) {
      setOpenSnackBar(true);
      navigator.clipboard.writeText(generatedLink);
    }
  }, [generatedLink]);

  const handleCopyInvitationLink = (groupId: string) => {
    generateLinkMutation(groupId);
  };

  const handleClick = (groupId: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [groupId]: !prevOpen[groupId],
    }));
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 6,
      top: -4,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  return (
    <>
      <Snackbar
        open={openSnackBar}
        onClose={() => setOpenSnackBar(false)}
        autoHideDuration={1000}
        message="הקישור נוצר והועתק"
      />

      <div className={styles.wrapper}>
        {managedGroups?.length > 0 && (
          <List
            sx={{
              width: "100%",
              maxWidth: 310,
              bgcolor: "background.paper",
              marginTop: "24px",
              marginLeft: "24px",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                קבוצות בניהולי
              </ListSubheader>
            }
          >
            {managedGroups?.map((group: any) => (
              <>
                <ListItemButton
                  key={group.id}
                  onClick={() => handleClick(group.id)}
                >
                  <ListItemIcon>
                    <StyledBadge
                      color="primary"
                      badgeContent={group.users?.length}
                      max={10}
                      sx={{ width: "10px" }}
                    >
                      <GroupIcon />
                    </StyledBadge>
                  </ListItemIcon>
                  <ListItemText primary={group.name} />
                  {open[group.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open[group.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {group?.users?.map((user: any) => (
                      <ListItemButton
                        sx={{ pl: 4 }}
                        key={`${user.id}-${group.id}`}
                      >
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={user.displayName} />
                      </ListItemButton>
                    ))}
                    <ListItemButton
                      sx={{ pl: 4 }}
                      key={`generate-${group.id}`}
                      onClick={() => handleCopyInvitationLink(group.id)}
                    >
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <ListItemText primary="הזמנה לקבוצה" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </>
            ))}
          </List>
        )}

        {sharedGroups?.length > 0 && (
          <List
            sx={{
              width: "100%",
              maxWidth: 310,
              bgcolor: "background.paper",
              marginTop: "24px",
              marginLeft: "16px",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                קבוצות ששותפו איתי
              </ListSubheader>
            }
          >
            {sharedGroups?.map((group: any) => (
              <>
                <ListItemButton
                  key={group.id}
                  onClick={() => handleClick(group.id)}
                >
                  <ListItemIcon>
                    <StyledBadge
                      color="primary"
                      badgeContent={group.users?.length}
                      max={10}
                      sx={{ width: "10px" }}
                    >
                      <GroupIcon />
                    </StyledBadge>
                  </ListItemIcon>
                  <ListItemText primary={group.name} />
                  {open[group.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open[group.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {group?.users?.map((user: any) => (
                      <ListItemButton
                        sx={{ pl: 4 }}
                        key={`${user.id}-${group.id}`}
                      >
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={user.displayName} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ))}
          </List>
        )}
      </div>
    </>
  );
}
