import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../utils/firebase.utils";
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

const CATEGORIES = ["Dairy", "Produce", "Bakery", "Meat", "Pantry"];

const GroceryListPage = () => {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [newItemName, setNewItemName] = useState("");

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: "", category: "" });

  const addItemMutation = useAddGroceryItemMutation(id!);
  const updateItemMutation = useUpdateGroceryItemMutation(id!);
  const deleteItemMutation = useDeleteGroceryItemMutation(id!);

  useEffect(() => {
    if (!id) return;

    const listRef = doc(db, "grocery_lists", id);
    const itemsRef = collection(db, "grocery_lists", id, "items");

    const unsubList = onSnapshot(listRef, (docSnap) => {
      setList({ id: docSnap.id, ...docSnap.data() });
    });

    const unsubItems = onSnapshot(
      query(itemsRef, orderBy("name")),
      (snapshot) => {
        const itemsArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsArr);
      }
    );

    return () => {
      unsubList();
      unsubItems();
    };
  }, [id]);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItemMutation.mutate({ name: newItemName.trim() });
      setNewItemName("");
    }
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

  return (
    <PageContainer>
      <Header variant="h4">{list?.name}</Header>

      <AddItemSection>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="הוספת פריט חדש"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <Button onClick={handleAddItem} variant="contained">
          הוספה
        </Button>
      </AddItemSection>

      <List>
        {[...unchecked, ...checked].map((item) => (
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
                    <Typography variant="body2">{item.amount || 1}</Typography>
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
                    primary={
                      item.isChecked ? (
                        <CheckedText>{item.name}</CheckedText>
                      ) : (
                        item.name
                      )
                    }
                    secondary={item.category || ""}
                  />
                </Box>
              </StyledListItem>
            )}
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </PageContainer>
  );
};

export default GroceryListPage;
