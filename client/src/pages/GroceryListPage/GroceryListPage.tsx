import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
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

const GroceryListPage = () => {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [newItemName, setNewItemName] = useState("");

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
      query(itemsRef, orderBy("createdAt")),
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

  const handleToggleItem = (item: any) => updateItemMutation.mutate(item);

  const handleDeleteItem = (itemId: string) =>
    deleteItemMutation.mutate(itemId);

  const unchecked = items.filter((i) => !i.isChecked);
  const checked = items.filter((i) => i.isChecked);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {list?.name}
      </Typography>

      <Box display="flex" mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="הוסף פריט חדש"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <Button onClick={handleAddItem} sx={{ ml: 1 }} variant="contained">
          הוסף
        </Button>
      </Box>

      <List>
        {[...unchecked, ...checked].map((item) => (
          <React.Fragment key={item.id}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <Checkbox
                edge="start"
                checked={item.isChecked}
                onChange={() => handleToggleItem(item)}
              />
              <ListItemText primary={item.name} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default GroceryListPage;
