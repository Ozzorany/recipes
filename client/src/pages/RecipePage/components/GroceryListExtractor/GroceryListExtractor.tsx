import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
  Typography,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGroceryLists } from "../../../../queries/useGroceryLists";
import { useExtractGroceryItems } from "../../../../queries/mutations/useExtractGroceryItems";
import { useAddGroceryItems } from "../../../../queries/mutations/useAddGroceryItems";
import { Recipe } from "../../../../models/recipe.model";
import { NewSelectedGroceryItem } from "../../../../models/grocery.model";
import { useCreateGroceryListMutation } from "../../../../queries/mutations/useCreateGroceryListMutation";
import { Add, Remove } from "@mui/icons-material";
import { styles } from "./GroceryListExtractor.styles";

interface GroceryListExtractorProps {
  open: boolean;
  onClose: () => void;
  recipe: Recipe;
}

const GroceryListExtractor: React.FC<GroceryListExtractorProps> = ({
  open,
  onClose,
  recipe,
}) => {
  const theme = useTheme();
  const { data: groceryLists, isLoading: listsLoading } = useGroceryLists();
  const [selectedList, setSelectedList] = useState<string>("");
  const [newListName, setNewListName] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<NewSelectedGroceryItem[]>(
    []
  );
  const [checkedItems, setCheckedItems] = useState<NewSelectedGroceryItem[]>(
    []
  );
  const [createNewList, setCreateNewList] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate: extractItems, isPending: extracting } =
    useExtractGroceryItems({
      onSuccess: (data) => {
        setSelectedItems(data);
        setCheckedItems(data);
      },
    });

  const { mutate: addItems, isPending: addingItems } = useAddGroceryItems({
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 5000);
    },
  });

  const { mutate: createList, isPending: creatingList } =
    useCreateGroceryListMutation();

  const handleExtract = () => {
    extractItems(recipe);
  };

  const handleSave = () => {
    if (createNewList) {
      createList(
        { name: newListName, items: checkedItems },
        {
          onSuccess: (newList) => {
            setSelectedList(newList.id);
            setCreateNewList(false);
            setShowSuccess(true);
            setTimeout(() => {
              onClose();
            }, 5000);
          },
        }
      );
    } else {
      addItems({
        listId: selectedList,
        items: checkedItems,
      });
    }
  };

  const toggleItem = (item: NewSelectedGroceryItem) => {
    setCheckedItems((prev) =>
      prev.some((i) => i.name === item.name)
        ? prev.filter((i) => i.name !== item.name)
        : [...prev, item]
    );
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };

  const updateAmount = (index: number, newAmount: number) => {
    if (newAmount < 1) return;

    const itemToUpdate = selectedItems[index];
    const updatedItem = { ...itemToUpdate, amount: newAmount };

    // Update selectedItems
    setSelectedItems((prev) =>
      prev.map((item, i) => (i === index ? updatedItem : item))
    );

    // Update checkedItems only if the item is already checked
    setCheckedItems((prevChecked) => {
      const exists = prevChecked.some((i) => i.name === itemToUpdate.name);

      if (!exists) return prevChecked;

      return prevChecked.map((item) =>
        item.name === itemToUpdate.name ? updatedItem : item
      );
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "start" }}>
          הוספת מצרכים לרשימת קניות
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
            <Button
              variant="contained"
              onClick={handleExtract}
              disabled={extracting}
              sx={{ mb: 2 }}
            >
              {extracting ? (
                <CircularProgress size={24} />
              ) : (
                "חלצו מצרכים מהמתכון"
              )}
            </Button>
          </Box>

          {selectedItems.length > 0 && (
            <>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, textAlign: "start" }}
              >
                בחרו את המצרכים שברצונכם להוסיף:
              </Typography>
              <List>
                {selectedItems.map((item, index) => (
                  <ListItem key={index} sx={styles.listItem}>
                    {/* Left Section: Checkbox + Text */}
                    <Box sx={styles.itemLeft}>
                      <Checkbox
                        checked={checkedItems.some((i) => i.name === item.name)}
                        onChange={() => toggleItem(item)}
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Box sx={styles.itemText}>
                        <Typography variant="body1" fontWeight={500}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          כמות: {item.amount ?? 1}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right Section: Amount Control */}
                    <Box sx={styles.amountControl}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateAmount(index, (item.amount ?? 1) - 1)
                        }
                        disabled={(item.amount ?? 1) <= 1}
                        sx={{
                          color:
                            (item.amount ?? 1) <= 1
                              ? "grey.400"
                              : theme.palette.primary.main,
                        }}
                      >
                        <Remove />
                      </IconButton>
                      <Typography sx={styles.amountNumber}>
                        {item.amount ?? 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateAmount(index, (item.amount ?? 1) + 1)
                        }
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 2, justifyContent: "flex-start" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={createNewList}
                      onChange={(e) => setCreateNewList(e.target.checked)}
                    />
                  }
                  label="צרו רשימה חדשה"
                  sx={{
                    textAlign: "start",
                    justifyContent: "flex-start",
                    display: "flex",
                  }}
                />

                {createNewList ? (
                  <TextField
                    fullWidth
                    label="שם הרשימה החדשה"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    select
                    label="בחרו רשימה קיימת"
                    value={selectedList}
                    onChange={(e) => setSelectedList(e.target.value)}
                    sx={{
                      mt: 1,
                      "& .MuiSelect-select": {
                        textAlign: "right",
                        display: "flex",
                        justifyContent: "flex-start",
                      },
                    }}
                  >
                    {groceryLists?.map((list) => (
                      <MenuItem key={list.id} value={list.id}>
                        {list.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end" }}>
          <Button onClick={onClose}>ביטול</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              !selectedItems.length ||
              (createNewList ? !newListName : !selectedList) ||
              addingItems ||
              creatingList
            }
          >
            {addingItems || creatingList ? (
              <CircularProgress size={24} />
            ) : (
              "שמירה"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          המצרכים נוספו בהצלחה לרשימת הקניות
        </Alert>
      </Snackbar>
    </>
  );
};

export default GroceryListExtractor;
