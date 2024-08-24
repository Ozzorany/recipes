import AddIcon from "@mui/icons-material/Add";
import AddLinkIcon from "@mui/icons-material/AddLink";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import { Badge, IconButton, Snackbar, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { BadgeProps } from "react-bootstrap";
import { useCreateNewGroup } from "../../queries/mutations/useCreateNewGroup";
import { useGenerateInvitationGroupLink } from "../../queries/mutations/useGenerateInvitationGroupLink";
import { useGroupsManagement } from "../../queries/useGroupsManagement";
import CreateNewGroupDialog from "./CreateNewGroupDialog/CreateNewGroupDialog";
import styles from "./GroupsManagement.module.css"; // Import css modules stylesheet as styles
import { useDeleteGroup } from "../../queries/mutations/useDeleteGroup";
import ApprovalDialog from "../../components/ApprovalDialog/ApprovalDialog";
import Lottie from "lottie-react";
import GroupAnimation from "../../assets/animations/GroupAnimation.json";

interface GroupState {
  [key: string]: boolean;
}

export default function GroupsManagement() {
  const [open, setOpen] = React.useState<GroupState>({});
  const [approvalDialogOpen, setApprovalDialogOpen] =
    React.useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState("");
  const [editMode, setEditMode] = React.useState(false);
  const [existingGroupName, setExistingGroupName] = React.useState("");
  const [existingGroupId, setExistingGroupId] = React.useState("");
  const [openCreateGroupDialog, setOpenCreateGroupDialog] =
    React.useState<boolean>(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const {
    data: userGroups,
    refetch,
    isLoading: isUserGroupsLoading,
  } = useGroupsManagement();
  const { mutate: createNewGroupMutation, isSuccess: createGroupSuccess } =
    useCreateNewGroup();
  const { mutate: deleteGroupMutation, isSuccess: deleteGroupSuccess } =
    useDeleteGroup();
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

  const createNewGroup = (groupName: string) => {
    createNewGroupMutation({ groupName, groupId: existingGroupId });
  };

  const handleDeleteGroup = (groupId: string) => {
    setApprovalDialogOpen(false);
    deleteGroupMutation({ groupId });
  };

  const handleOpenDeleteApprovalDialog = (event: any, groupId: string) => {
    event.stopPropagation();
    setSelectedGroupId(groupId);
    setApprovalDialogOpen(true);
  };

  React.useEffect(() => {
    if (createGroupSuccess || deleteGroupSuccess) {
      refetch();
    }
  }, [createGroupSuccess, deleteGroupSuccess]);

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 6,
      top: -4,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const handleEditGroupName = (
    event: any,
    groupId: string,
    groupName: string
  ) => {
    event.stopPropagation();
    setEditMode(true);
    setExistingGroupName(groupName);
    setOpenCreateGroupDialog(true);
    setExistingGroupId(groupId);
  };

  const handleCreateNewGroup = () => {
    setEditMode(false);
    setExistingGroupName("");
    setExistingGroupId("");
    setOpenCreateGroupDialog(true);
  };

  if (isUserGroupsLoading) {
    return (
      <div
      style={{
        height: "100vh",
        maxWidth: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", // Center horizontally
        overflow: "hidden" // Ensure animation stays within the container
      }}
    >
      <div style={{ width: '100%', height: 'auto', maxWidth: '100%' }}>
        <Lottie
          animationData={GroupAnimation}
          loop={true}
          style={{ width: '100%', height: 'auto' }} // Adjust the size of the Lottie animation
        />
      </div>
      <Typography
            style={{
              color: "white"
            }}
            variant="h5"
          >
            מחפש קבוצות...
          </Typography>
    </div>
    );
  }

  return (
    <>
      <ApprovalDialog
        title="האם אתם בטוחים?"
        content="אתם עומדים למחוק את הקבוצה. היא תימחק גם עבור המשתמשים שהוזמנו להיות חלק ממנה."
        open={approvalDialogOpen}
        setOpen={setApprovalDialogOpen}
        mainAction={handleDeleteGroup}
        params={selectedGroupId}
      />

      <CreateNewGroupDialog
        open={openCreateGroupDialog}
        setOpen={setOpenCreateGroupDialog}
        mainAction={createNewGroup}
        isEditMode={editMode}
        existingGroupName={existingGroupName}
        existingGroupId={existingGroupId}
      />
      <Snackbar
        open={openSnackBar}
        onClose={() => setOpenSnackBar(false)}
        autoHideDuration={1000}
        message="הקישור נוצר והועתק"
      />

      <div className={styles.wrapper}>
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
            <div>
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
                <ListItemText
                  primary={
                    <div className={styles.groupNameWrapper}>
                      <Typography className={styles.groupName}>
                        {group.name}
                      </Typography>
                      {open[group.id] ? <ExpandLess /> : <ExpandMore />}
                    </div>
                  }
                />
                <div className={styles.actions}>
                  <IconButton
                    onClick={(event) =>
                      handleEditGroupName(event, group.id, group.name)
                    }
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={(event) =>
                      handleOpenDeleteApprovalDialog(event, group.id)
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
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
                      <ListItemText
                        primary={
                          <Typography className={styles.groupMember}>
                            {user.displayName}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  ))}
                  <ListItemButton
                    sx={{ pl: 4 }}
                    key={`generate-${group.id}`}
                    onClick={() => handleCopyInvitationLink(group.id)}
                  >
                    <ListItemIcon>
                      <AddLinkIcon />
                    </ListItemIcon>
                    <ListItemText primary="הזמנה לקבוצה" />
                  </ListItemButton>
                </List>
              </Collapse>
            </div>
          ))}
          <ListItemButton onClick={handleCreateNewGroup}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="יצירת קבוצה חדשה" />
          </ListItemButton>
        </List>

        {sharedGroups?.length > 0 && (
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
                  <ListItemText
                    primary={
                      <Typography className={styles.groupName}>
                        {group.name}
                      </Typography>
                    }
                  />
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
                        <ListItemText
                          primary={
                            <Typography className={styles.groupMember}>
                              {user.displayName}
                            </Typography>
                          }
                        />
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
