//@ts-check
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IngredientsList from "../components/IngredientsList";
import Tags from "../components/Tags";
import UploadImages from "../components/UploadImages";
import { httpUploadImage } from "../hooks/requests";
import { Ingredient } from "../models/ingredient.model";
import { Recipe, SiteRecipe } from "../models/recipe.model";
import styles from "./CreateRecipe.module.css";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../utils/firebase.utils";
import MultiSelect from "../components/MultiSelect/MultiSelect";
import { useGroups } from "../queries/useGroups";
import { useCreateRecipe } from "../queries/mutations/useCreateRecipe";
import LoadingButton from "@mui/lab/LoadingButton";
import { useUpdateRecipe } from "../queries/mutations/useUpdateRecipe";
import PhotoFilterIcon from "@mui/icons-material/PhotoFilter";
import GenerateRecipeFromSiteDialog from "./RecipePage/components/GenerateRecipeFromSiteDialog/GenerateRecipeFromSiteDialog";
import { Fab, IconButton, useTheme } from "@mui/material";
import { useUserFeatures } from "../queries/useUserFeatures";
import { USER_FEATURES } from "../models/user.model";
import GenerateRecipeAssistantDialog from "./GenerateRecipeAssistantDialog/GenerateRecipeAssistantDialog";
import AssistantIcon from "@mui/icons-material/Assistant";

function CreateRecipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [recipeDescriptionValid, setRecipeDescriptionValid] =
    useState<boolean>(true);
  const [methodValid, setMethodValid] = useState<boolean>(true);
  const [openGenerateRecipeFromSite, setOpenGenerateRecipeFromSite] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isImageRemoved, setIsImageRemoved] = useState<boolean>(false);
  const [openAssistantDialog, setOpenAssistantDialog] = useState(false);
  const { data: userGroups } = useGroups();
  const ingredientRef = useRef<any>(null);
  const methodRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { state }: { state: any } = useLocation();
  const isEdit: boolean = !!state?.isEdit ? state?.isEdit : false;
  const editRecipe: Recipe = !!state?.recipe ? state?.recipe : null;
  const user = auth.currentUser;
  const { data: features, isLoading: featuresLoading } = useUserFeatures();
  const theme = useTheme();

  const { mutate: createRecipeMutation, isPending: createRecipeLoading } =
    useCreateRecipe({
      onSuccess: (newRecipeId: string) => {
        navigate(`/recipe/${newRecipeId}`);
      },
    });
  const { mutate: updateRecipeMutation, isPending: updateRecipeLoading } =
    useUpdateRecipe({
      onSuccess: () => {
        navigate(`/all-recipes`);
      },
    });

  const reseIngredientsRef = () => {
    ingredientRef.current.value = "";
  };

  useEffect(() => {
    if (!featuresLoading) {
      if (isEdit) {
        descriptionRef.current.value = editRecipe.description;
        methodRef.current.value = editRecipe.method;
        setGroups(() => editRecipe.sharedGroups || []);
        setTags(() => editRecipe.tags);
        setIngredients(() =>
          editRecipe.ingredients.map((ingredient) => {
            return { id: uuidv4(), description: ingredient };
          })
        );
      } else {
        descriptionRef.current.value = "";
        methodRef.current.value = "";
        setTags(() => []);
        setGroups(() => []);
        setIngredients(() => []);
      }
    }
  }, [isEdit, editRecipe, featuresLoading]);

  useEffect(() => {
    reseIngredientsRef();
  }, [ingredients]);

  const confirmHandler = (event: any) => {
    event.preventDefault();
    setErrorValidations();

    const newRecipe: Recipe = {
      id: isEdit ? editRecipe.id : "1",
      description: descriptionRef.current.value,
      ingredients: ingredients.map((ingredient) => ingredient.description),
      method: methodRef.current.value,
      tags: tags,
      image: getNewImage(),
      creatorId: user?.uid || "",
      sharedGroups: groups,
      isDeleted: false,
      likes: isEdit ? editRecipe.likes : [],
    };

    if (
      methodRef.current.value.trim() !== "" &&
      descriptionRef.current.value.trim() !== ""
    ) {
      if (!!selectedImage) {
        httpUploadImage(selectedImage).then((res: any) => {
          newRecipe.image = res.data.downloadUrl;
          executeSubmition(newRecipe);
        });
      } else {
        executeSubmition(newRecipe);
      }
    }
  };

  const getNewImage = () => {
    if (isImageRemoved) {
      return null;
    } else if (!!selectedImage) {
      return selectedImage;
    } else if (isEdit && !selectedImage) {
      return editRecipe.image;
    }

    return null;
  };

  const executeSubmition = (recipe: Recipe): void => {
    if (isEdit) {
      updateRecipeMutation(recipe);
    } else {
      createRecipeMutation(recipe);
    }
  };

  const setErrorValidations = () => {
    if (descriptionRef.current.value.trim() === "") {
      setRecipeDescriptionValid(false);
    } else {
      setRecipeDescriptionValid(true);
    }

    if (methodRef.current.value.trim() === "") {
      setMethodValid(false);
    } else {
      setRecipeDescriptionValid(true);
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setTags(() => tags);
  };

  const handleGroupsChange = (groups: string[]) => {
    setGroups(() => groups);
  };

  const addIngredient = () => {
    const newId = uuidv4();
    if (!!ingredientRef.current && ingredientRef.current.value.trim() !== "") {
      setIngredients((currentIngredients) => [
        ...currentIngredients,
        { id: newId, description: ingredientRef.current.value },
      ]);
    }
  };

  const handleSelectImage = (imageValue: any) => {
    setSelectedImage(imageValue);
    if (!!imageValue) {
      setIsImageRemoved(false);
    } else {
      setIsImageRemoved(true);
    }
  };

  const handlngredientsKeyPress = (event: any) => {
    if (event.keyCode === 13) {
      addIngredient();
    }
  };

  const removeIngredient = (ingredient: Ingredient) => {
    setIngredients((currentIngredients) =>
      currentIngredients.filter(
        (currIngredient) => currIngredient.id !== ingredient.id
      )
    );
  };

  return (
    <>
      {!featuresLoading &&
        features?.includes(USER_FEATURES.RECIPE_FROM_SITE_TOGGLE) && (
          <IconButton
            aria-label="generateRecipe"
            onClick={() => setOpenGenerateRecipeFromSite(true)}
            sx={{ outline: "none !important" }}
          >
            <PhotoFilterIcon style={{ color: "palegreen" }} fontSize="large" />
          </IconButton>
        )}

      <form
        className={styles.form}
        style={{
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <div className={styles.control}>
          <label htmlFor="name">שם מתכון</label>
          <input
            type="text"
            id="name"
            ref={descriptionRef}
            autoComplete="off"
          />
          {!recipeDescriptionValid && (
            <p className={styles.errorValidation}>יש להזין שם מתכון</p>
          )}
        </div>
        <div className={styles.control}>
          <label htmlFor="street">מצרכים</label>
          <div className="d-flex justify-content-center">
            <input
              type="text"
              id="street"
              autoComplete="off"
              ref={ingredientRef}
              style={{ height: "2.2rem" }}
              onKeyDown={handlngredientsKeyPress}
            />
            <Button variant="contained" onClick={addIngredient}>
              הוספה
            </Button>
          </div>
        </div>
        {!!ingredients.length && (
          <div className={styles.ingredients}>
            <IngredientsList
              ingredients={ingredients}
              removeIngredient={removeIngredient}
            />
          </div>
        )}

        <div
          className={styles.control}
          style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
        >
          <label htmlFor="method">אופן הכנה</label>
          <textarea
            id="method"
            style={{ width: "30vw", height: "20vh" }}
            ref={methodRef}
          ></textarea>
          {!methodValid && (
            <p className={styles.errorValidation}>יש להזין אופן הכנה</p>
          )}
        </div>
        <div className={styles.control}>
          <Tags submitTagsChange={handleTagsChange} currentTags={tags} />
        </div>

        <div>
          <UploadImages
            onSelectedImage={handleSelectImage}
            currentImage={isEdit ? editRecipe.image : null}
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <MultiSelect
            values={userGroups}
            currentValues={editRecipe?.sharedGroups}
            submitValuesChange={handleGroupsChange}
          />
        </div>
        <div className={styles.actions}>
          <LoadingButton
            loading={createRecipeLoading || updateRecipeLoading}
            type="button"
            className={styles.submit}
            onClick={confirmHandler}
            disabled={isEdit && editRecipe?.creatorId !== user?.uid}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              border: `1px solid ${theme.palette.primary.main}`,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {isEdit ? "עריכת מתכון" : "יצירת מתכון"}
          </LoadingButton>
        </div>
      </form>

      <GenerateRecipeFromSiteDialog
        title="מתכון קיים"
        open={openGenerateRecipeFromSite}
        setOpen={setOpenGenerateRecipeFromSite}
        mainAction={(siteRecipe: SiteRecipe) => {
          if (siteRecipe) {
            methodRef.current.value = siteRecipe.method;
            descriptionRef.current.value = siteRecipe.title;
            setIngredients(() =>
              siteRecipe.ingredients.map((ingredient) => {
                return { id: uuidv4(), description: ingredient };
              })
            );
          }
        }}
      />

      {!isEdit && (
        <Fab
          color="info"
          aria-label="assistant"
          onClick={() => setOpenAssistantDialog(true)}
          sx={{
            position: "fixed",
            bottom: 25,
            left: 25,
            zIndex: 1200,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText, // icon color
            boxShadow: `0px 4px 20px ${theme.palette.primary.main}66`,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: `0px 0px 20px 4px ${theme.palette.primary.main}`,
            },
          }}
        >
          <AssistantIcon />
        </Fab>
      )}

      <GenerateRecipeAssistantDialog
        open={openAssistantDialog}
        setOpen={setOpenAssistantDialog}
        onRecipeGenerated={(recipe: SiteRecipe) => {
          methodRef.current.value = recipe.method;
          descriptionRef.current.value = recipe.title;
          setIngredients(
            recipe.ingredients.map((ing) => ({
              id: uuidv4(),
              description: ing,
            }))
          );
        }}
      />
    </>
  );
}

export default CreateRecipe;
