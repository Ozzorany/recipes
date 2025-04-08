import React, { useEffect, useState } from "react";
import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupIcon from "@mui/icons-material/Group";
import { auth, db } from "../../utils/firebase.utils";
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
  getDocs,
} from "firebase/firestore";
import {
  PageWrapper,
  GridContainer,
  StyledCard,
  Title,
  Stats,
  CardFooter,
  MenuButton,
} from "./UserGroceryLists.styles";
import { useNavigate } from "react-router-dom";

const UserGroceryLists = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<DocumentData[]>([]);
  const [anchorEls, setAnchorEls] = useState<
    Record<string, HTMLElement | null>
  >({});

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const ref = collection(db, "grocery_lists");
    const q1 = query(ref, where("members", "array-contains", uid));
    const q2 = query(ref, where("ownerId", "==", uid));

    const listsMap = new Map<string, any>();

    const updateListFromSnapshot = async (snapshot: any) => {
      const promises = snapshot.docs.map(async (doc: any) => {
        const data = doc.data();
        const itemsSnap = await getDocs(
          collection(db, "grocery_lists", doc.id, "items")
        );

        listsMap.set(doc.id, {
          id: doc.id,
          ...data,
          itemsCount: itemsSnap.size,
          membersCount: data.members?.length || 0,
          isOwner: data.ownerId === uid,
        });
      });

      await Promise.all(promises);

      // Update state with deduplicated list
      setLists(Array.from(listsMap.values()));
    };

    const unsub1 = onSnapshot(q1, updateListFromSnapshot);
    const unsub2 = onSnapshot(q2, updateListFromSnapshot);

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    listId: string
  ) => {
    setAnchorEls((prev) => ({ ...prev, [listId]: event.currentTarget }));
  };

  const handleMenuClose = (listId: string) => {
    setAnchorEls((prev) => ({ ...prev, [listId]: null }));
  };

  return (
    <PageWrapper>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        רשימות הקניות שלי
      </Typography>

      <GridContainer>
        {lists.map((list) => (
          <StyledCard
            key={list.id}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/grocery-list/${list.id}`)}
          >
            <MenuButton onClick={(e) => handleMenuOpen(e, list.id)}>
              <MoreVertIcon />
            </MenuButton>
            <Menu
              anchorEl={anchorEls[list.id]}
              open={Boolean(anchorEls[list.id])}
              onClose={() => handleMenuClose(list.id)}
            >
              <MenuItem onClick={() => console.log("Edit", list.id)}>
                ערוך
              </MenuItem>
              <MenuItem onClick={() => console.log("Delete", list.id)}>
                מחק
              </MenuItem>
              <MenuItem onClick={() => console.log("Invite", list.id)}>
                הזמן חבר
              </MenuItem>
            </Menu>

            <Title>{list.name}</Title>

            <Stats>
              <span>{list.itemsCount} פריטים</span>
              <Tooltip title={`${list.membersCount} חברים`}>
                <Badge badgeContent={list.membersCount} color="primary">
                  <GroupIcon color="action" />
                </Badge>
              </Tooltip>
            </Stats>

            <CardFooter>
              <Typography variant="caption">
                {list.isOwner ? "(בעלותך)" : "(שותף)"}
              </Typography>
            </CardFooter>
          </StyledCard>
        ))}
      </GridContainer>
    </PageWrapper>
  );
};

export default UserGroceryLists;
