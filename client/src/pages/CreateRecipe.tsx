//@ts-check
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IngredientsList from "../components/IngredientsList";
import Tags from "../components/Tags";
import UploadImages from "../components/UploadImages";
import { httpUploadImage } from "../hooks/requests";
import { useAppDispatch } from "../hooks/storeHooks";
import { Ingredient } from "../models/ingredient.model";
import { Recipe } from "../models/recipe.model";
import { createRecipe, updateRecipe } from "../state/recipesSlice";
import styles from "./CreateRecipe.module.css";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../utils/firebase.utils";
import MultiSelect from "../components/MultiSelect/MultiSelect";
import { useGroups } from "../queries/useGroups";

function CreateRecipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [recipeDescriptionValid, setRecipeDescriptionValid] =
    useState<boolean>(true);
  const [methodValid, setMethodValid] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isImageRemoved, setIsImageRemoved] = useState<boolean>(false);
  const { data: userGroups } = useGroups();
  const ingredientRef = useRef<any>();
  const methodRef = useRef<any>();
  const descriptionRef = useRef<any>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state }: { state: any } = useLocation();
  const isEdit: boolean = !!state?.isEdit ? state?.isEdit : false;
  const editRecipe: Recipe = !!state?.recipe ? state?.recipe : null;
  const user = auth.currentUser;

  useEffect(() => {
    if (isEdit) {
      descriptionRef.current.value = editRecipe.description;
      methodRef.current.value = editRecipe.method;
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
  }, [isEdit, editRecipe]);

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
      likes: []
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

      navigate("/all-recipes", { replace: true });
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
      dispatch(updateRecipe(recipe));
    } else {
      dispatch(createRecipe(recipe));
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

  const reseIngredientsRef = () => {
    ingredientRef.current.value = "";
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

  useEffect(() => {
    reseIngredientsRef();
  }, [ingredients]);

  return (
    <form className={styles.form}>
      <div className={styles.control}>
        <label htmlFor="name">שם מתכון</label>
        <input type="text" id="name" ref={descriptionRef} autoComplete="off" />
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
        <Button
          type="button"
          className={styles.submit}
          onClick={confirmHandler}
          disabled={isEdit && editRecipe?.creatorId !== user?.uid}
        >
          {isEdit ? "עריכת מתכון" : "יצירת מתכון"}
        </Button>
      </div>
    </form>
  );
}

export default CreateRecipe;
