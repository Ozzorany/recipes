import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteGroceryListMutation } from "../../queries/mutations/useDeleteGroceryListMutation";
import { useRemoveUserFromGroceryList } from "../../queries/mutations/useRemoveUserFromGroceryList";
import { useUserGroceryLists } from "../../queries/useUserGroceryLists";
import { auth } from "../../utils/firebase.utils";
import CreateGroceryListDialog from "./components/CreateGroceryListDialog/CreateGroceryListDialog";
import GroceryListSkeleton from "./components/GroceryListSkeleton/GroceryListSkeleton";
import InvitationDialog from "./components/InvitationDialog/InvitationDialog";
import {
  CardFooter,
  GridContainer,
  MemberChip,
  MenuButton,
  OwnershipChip,
  PageWrapper,
  SharedChip,
  Stats,
  StyledCard,
  Title,
} from "./UserGroceryLists.styles";

const UserGroceryLists = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isInvitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [anchorEls, setAnchorEls] = useState<
    Record<string, HTMLElement | null>
  >({});
  const deleteListMutation = useDeleteGroceryListMutation();
  const removeUserMutation = useRemoveUserFromGroceryList();
  const { data: lists = [], isPending: isListLoading } = useUserGroceryLists();

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    listId: string
  ) => {
    setAnchorEls((prev) => ({ ...prev, [listId]: event.currentTarget }));
  };

  const handleMenuClose = (listId: string) => {
    setAnchorEls((prev) => ({ ...prev, [listId]: null }));
  };

  const handleDeleteList = (listId: string) => {
    deleteListMutation.mutate(listId, {
      onSuccess: () => {
        handleMenuClose(listId);
      },
    });
  };

  const handleLeaveList = (listId: string) => {
    removeUserMutation.mutate(
      { listId, userId: auth.currentUser?.uid || "" },
      {
        onSuccess: () => {
          handleMenuClose(listId);
        },
      }
    );
  };

  const handleInviteClick = (listId: string, listName: string) => {
    setSelectedList({ id: listId, name: listName });
    setInvitationDialogOpen(true);
    handleMenuClose(listId);
  };

  return (
    <>
      <PageWrapper>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          flexWrap="wrap"
          mb={3}
        >
          <Typography variant="h4" fontWeight={600}>
            רשימת הקניות שלי
          </Typography>

          {lists.length > 0 && (
            <Box mt={{ xs: 2, sm: 0 }}>
              <Button
                variant="contained"
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  borderRadius: "12px",
                  paddingX: 3,
                  paddingY: 1,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                + רשימה חדשה
              </Button>
            </Box>
          )}
        </Box>

        {isListLoading ? (
          <GridContainer>
            {[...Array(3)].map((_, index) => (
              <GroceryListSkeleton key={index} />
            ))}
          </GridContainer>
        ) : lists.length === 0 ? (
          <Box
            mt={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6" gutterBottom>
              אין לך עדיין רשימות קניות.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                mt: 2,
                borderRadius: "12px",
                paddingX: 4,
                paddingY: 1.2,
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              צור רשימת קניות ראשונה
            </Button>
          </Box>
        ) : (
          <GridContainer>
            {lists?.map((list: any) => (
              <StyledCard
                key={list.id}
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/grocery-list/${list.id}`)}
              >
                <MenuButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, list.id);
                  }}
                >
                  <MoreVertIcon />
                </MenuButton>
                <Menu
                  anchorEl={anchorEls[list.id]}
                  open={Boolean(anchorEls[list.id])}
                  onClose={() => handleMenuClose(list.id)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {list.isOwner ? (
                    <>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInviteClick(list.id, list.name);
                        }}
                      >
                        הזמנת חבר
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteList(list.id);
                        }}
                      >
                        מחיקה
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeaveList(list.id);
                      }}
                    >
                      צאו מהרשימה
                    </MenuItem>
                  )}
                </Menu>

                <Title>{list.name}</Title>

                <Stats>
                  <span>{list.items?.length} פריטים</span>
                </Stats>

                <CardFooter>
                  <MemberChip
                    icon={<GroupIcon fontSize="small" />}
                    label={`${(list.members?.length || 0) + 1} חברים`}
                  />

                  {list.isOwner ? (
                    <OwnershipChip label="רשימה שלי" size="small" />
                  ) : (
                    <SharedChip label="שותף איתי" size="small" />
                  )}
                </CardFooter>
              </StyledCard>
            ))}
          </GridContainer>
        )}
      </PageWrapper>

      <CreateGroceryListDialog
        open={isCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      <InvitationDialog
        open={isInvitationDialogOpen}
        onClose={() => setInvitationDialogOpen(false)}
        listId={selectedList?.id || ""}
        listName={selectedList?.name || ""}
      />
    </>
  );
};

export default UserGroceryLists;
