import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  List,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Divider,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import {
  Add,
  Delete,
  Remove,
  ArrowForward,
  ShoppingCart,
} from "@mui/icons-material";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../utils/firebase.utils";
import {
  useAddGroceryItemMutation,
  useUpdateGroceryItemMutation,
  useDeleteGroceryItemMutation,
} from "../../queries/mutations/useGroceryItemMutations";
import {
  PageContainer,
  Header,
  AddItemSection,
  StyledListItem,
  StyledItemText,
  AmountControls,
  CheckedText,
  EditItemBox,
} from "./GroceryListPage.styles";
import GroceryListSkeleton from "./GroceryListSkeleton";

const CATEGORIES = [
  "פירות",
  "ירקות",
  "מוצרי חלב",
  "בשר ועוף",
  "דגים",
  "קפואים",
  "מעדנייה",
  "מאפים ולחמים",
  "מוצרים יבשים",
  "שימורים",
  "תבלינים",
  "חטיפים",
  "ממתקים",
  "ממרחים",
  "משקאות",
  "אלכוהול",
  "ניקיון",
  "טואלטיקה והיגיינה",
  "תינוקות וילדים",
  "חיות מחמד",
  "כלי בית וכלים חד פעמיים",
  "בריאות וטבע",
  "מזון מהיר",
  "בישול ואפייה",
];

interface GroceryItem {
  id: string;
  name: string;
  category?: string;
  isChecked: boolean;
  amount?: number;
}

const GroceryListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<any>(null);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: "", category: "" });

  const addItemMutation = useAddGroceryItemMutation(id!);
  const updateItemMutation = useUpdateGroceryItemMutation(id!);
  const deleteItemMutation = useDeleteGroceryItemMutation(id!);

  useEffect(() => {
    if (!id) return;

    const checkAccess = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/login");
        return false;
      }

      const listRef = doc(db, "grocery_lists", id);
      const listDoc = await getDoc(listRef);

      if (!listDoc.exists()) {
        navigate("/grocery-lists");
        return false;
      }

      const listData = listDoc.data();
      const isOwner = listData.ownerId === currentUser.uid;
      const isMember = listData.members?.includes(currentUser.uid);

      if (!isOwner && !isMember) {
        navigate("/grocery-lists");
        return false;
      }

      return true;
    };

    const setupListeners = async () => {
      const hasAccess = await checkAccess();
      if (!hasAccess) return;

      const listRef = doc(db, "grocery_lists", id);
      const itemsRef = collection(db, "grocery_lists", id, "items");

      const unsubList = onSnapshot(listRef, (docSnap) => {
        setList({ id: docSnap.id, ...docSnap.data() });
        setIsLoading(false);
      });

      const unsubItems = onSnapshot(
        query(itemsRef, orderBy("name")),
        (snapshot) => {
          const itemsArr = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            category: doc.data().category,
            isChecked: doc.data().isChecked || false,
            amount: doc.data().amount || 1,
          })) as GroceryItem[];
          setItems(itemsArr);
        }
      );

      return () => {
        unsubList();
        unsubItems();
      };
    };

    setupListeners();
  }, [id, navigate]);

  const handleAddItem = (value: string | null) => {
    if (!value) return;

    const existingItem = items.find(
      (item) => item.name.toLowerCase() === value.toLowerCase()
    );

    if (existingItem && existingItem.isChecked) {
      handleToggleItem(existingItem);
    }

    if (!existingItem) {
      addItemMutation.mutate({ name: value.trim() });
    }
    setNewItemName("");
  };

  const handleToggleItem = (item: any) =>
    updateItemMutation.mutate({ ...item, isChecked: !item.isChecked });

  const handleDeleteItem = (itemId: string) =>
    deleteItemMutation.mutate(itemId);

  const handleAdjustAmount = (item: any, diff: number) => {
    const newAmount = (item.amount || 1) + diff;
    if (newAmount <= 0) {
      handleDeleteItem(item.id);
    } else {
      updateItemMutation.mutate({ ...item, amount: newAmount });
    }
  };

  const startEditing = (item: any) => {
    setEditingItemId(item.id);
    setEditValues({ name: item.name, category: item.category || "" });
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditValues({ name: "", category: "" });
  };

  const saveItemEdits = (item: any) => {
    updateItemMutation.mutate({
      ...item,
      name: editValues.name,
      category: editValues.category,
    });
    cancelEditing();
  };

  const unchecked = items.filter((i) => !i.isChecked);
  const checked = items.filter((i) => i.isChecked);

  // Group unchecked items by category
  const groupedItems = unchecked.reduce(
    (acc: Record<string, GroceryItem[]>, item) => {
      const category = item.category || "כללי";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, GroceryItem[]>
  );

  // Sort items within each category by name
  Object.keys(groupedItems).forEach((category) => {
    groupedItems[category].sort((a: GroceryItem, b: GroceryItem) =>
      a.name.localeCompare(b.name)
    );
  });

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    if (a === "כללי") return 1;
    if (b === "כללי") return -1;
    return a.localeCompare(b);
  });

  const handleInputChange = (
    _: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setNewItemName(newInputValue);
  };

  return (
    <PageContainer>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={2}
        alignContent="center"
      >
        <IconButton onClick={() => navigate("/grocery-lists")}>
          <ArrowForward />
        </IconButton>
        <Header variant="h4">{list?.name}</Header>
      </Box>

      <AddItemSection>
        <Autocomplete
          freeSolo
          options={items.map((item) => item.name)}
          value={newItemName}
          onChange={(_, newValue) => handleAddItem(newValue)}
          onInputChange={handleInputChange}
          filterOptions={(options) => {
            const inputValue = newItemName.toLowerCase();
            return options.filter((option) =>
              option.toLowerCase().includes(inputValue)
            );
          }}
          noOptionsText="לא נמצאו תוצאות"
          open={newItemName.length > 0}
          sx={{ width: "100%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              placeholder="הוספת פריט חדש"
              sx={{ width: "100%" }}
            />
          )}
        />
        <Button
          onClick={() => handleAddItem(newItemName)}
          variant="contained"
          disabled={!newItemName.trim()}
        >
          הוספה
        </Button>
      </AddItemSection>

      {isLoading ? (
        <GroceryListSkeleton />
      ) : (
        <List>
          {/* Render unchecked items grouped by category */}
          {sortedCategories.map((category) => (
            <React.Fragment key={category}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, px: 2 }}>
                {category}
              </Typography>
              {groupedItems[category].map((item: GroceryItem) => (
                <React.Fragment key={item.id}>
                  {editingItemId === item.id ? (
                    <EditItemBox>
                      <TextField
                        label="שם הפריט"
                        fullWidth
                        size="small"
                        value={editValues.name}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                      <FormControl size="small" fullWidth>
                        <InputLabel>קטגוריה</InputLabel>
                        <Select
                          value={editValues.category}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          label="קטגוריה"
                        >
                          {CATEGORIES.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                              {cat}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => saveItemEdits(item)}
                        >
                          שמור
                        </Button>
                        <Button size="small" onClick={cancelEditing}>
                          ביטול
                        </Button>
                      </Box>
                    </EditItemBox>
                  ) : (
                    <StyledListItem
                      secondaryAction={
                        <AmountControls>
                          <IconButton
                            size="small"
                            onClick={() => handleAdjustAmount(item, -1)}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography variant="body2">
                            {item.amount || 1}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleAdjustAmount(item, 1)}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </AmountControls>
                      }
                    >
                      <Checkbox
                        edge="start"
                        checked={item.isChecked}
                        onChange={() => handleToggleItem(item)}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        sx={{ cursor: "pointer" }}
                        onClick={() => startEditing(item)}
                      >
                        <StyledItemText
                          primary={item.name}
                          secondary={item.category || ""}
                        />
                      </Box>
                    </StyledListItem>
                  )}
                  <Divider />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}

          {/* Render checked items at the bottom */}
          {checked.length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 2,
                  mb: 1,
                  px: 2,
                }}
              >
                <ShoppingCart sx={{ mr: 1 }} />
                <Typography variant="h6">כבר בסל</Typography>
              </Box>
              {checked.map((item) => (
                <React.Fragment key={item.id}>
                  {editingItemId === item.id ? (
                    <EditItemBox>
                      <TextField
                        label="שם הפריט"
                        fullWidth
                        size="small"
                        value={editValues.name}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                      <FormControl size="small" fullWidth>
                        <InputLabel>קטגוריה</InputLabel>
                        <Select
                          value={editValues.category}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          label="קטגוריה"
                        >
                          {CATEGORIES.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                              {cat}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => saveItemEdits(item)}
                        >
                          שמור
                        </Button>
                        <Button size="small" onClick={cancelEditing}>
                          ביטול
                        </Button>
                      </Box>
                    </EditItemBox>
                  ) : (
                    <StyledListItem
                      secondaryAction={
                        <AmountControls>
                          <IconButton
                            size="small"
                            onClick={() => handleAdjustAmount(item, -1)}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography variant="body2">
                            {item.amount || 1}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleAdjustAmount(item, 1)}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </AmountControls>
                      }
                    >
                      <Checkbox
                        edge="start"
                        checked={item.isChecked}
                        onChange={() => handleToggleItem(item)}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        sx={{ cursor: "pointer" }}
                        onClick={() => startEditing(item)}
                      >
                        <StyledItemText
                          primary={<CheckedText>{item.name}</CheckedText>}
                          secondary={item.category || ""}
                        />
                      </Box>
                    </StyledListItem>
                  )}
                  <Divider />
                </React.Fragment>
              ))}
            </>
          )}
        </List>
      )}
    </PageContainer>
  );
};

export default GroceryListPage;
