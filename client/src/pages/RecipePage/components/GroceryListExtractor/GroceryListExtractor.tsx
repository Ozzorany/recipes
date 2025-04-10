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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGroceryLists } from "../../../../queries/useGroceryLists";
import { useExtractGroceryItems } from "../../../../queries/mutations/useExtractGroceryItems";
import { useAddGroceryItems } from "../../../../queries/mutations/useAddGroceryItems";
import { Recipe } from "../../../../models/recipe.model";
import { NewSelectedGroceryItem } from "../../../../models/grocery.model";
import { useCreateGroceryListMutation } from "../../../../queries/mutations/useCreateGroceryListMutation";

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
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
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
                  <ListItem key={index} sx={{ justifyContent: "flex-start" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedItems.includes(item)}
                          onChange={() => toggleItem(item)}
                          sx={{ color: theme.palette.primary.main }}
                        />
                      }
                      label={`${item.name}`}
                      sx={{ textAlign: "start" }}
                    />
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
