import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import styles from "./GroupsManagement.module.css"; // Import css modules stylesheet as styles
import { auth } from "../../utils/firebase.utils";
import { useGroupsManagement } from "../../queries/useGroupsManagement";
import GroupIcon from "@mui/icons-material/Group";
import { Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BadgeProps } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";

interface GroupState {
  [key: string]: boolean;
}

export default function GroupsManagement() {
  const [open, setOpen] = React.useState<GroupState>({});
  const currentAuthUser = auth.currentUser;
  const { data: userGroups } = useGroupsManagement();
  const managedGroups = userGroups?.managedGroups || [];
  const sharedGroups = userGroups?.sharedGroups || [];

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
                  <GroupIcon />
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
                        <Avatar
                          alt="Remy Sharp"
                          src={user.logo}
                          imgProps={{ referrerPolicy: "no-referrer" }}
                          sx={{ width: 30, height: 30 }}
                        />
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
  );
}
