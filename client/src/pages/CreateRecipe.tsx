import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import IngredientsList from "../components/IngredientsList";
import Tags from "../components/Tags";
import { Recipe } from "../models/recipe.model";
import styles from './CreateRecipe.module.css';

function CreateRecipe({ submitRecipe }: { submitRecipe: (recipe: Recipe) => {} }) {
    const [ingredients, setIngredients] = useState<string[]>([])
    const [tags, setTags] = useState<string[]>([])
    const ingredientRef = useRef<any>();
    const methodRef = useRef<any>();
    const descriptionRef = useRef<any>();
    const navigate = useNavigate()


    const confirmHandler = (event: any) => {
        event.preventDefault();

        const newRecipe: Recipe = {
            id: '1',
            description: descriptionRef.current.value,
            ingredients: ingredients,
            method: methodRef.current.value,
            tags: tags
        };

        submitRecipe(newRecipe);
        navigate('/all-recipes', { replace: true });
    };

    const handleTagsChange = (tags: string[]) => {
        setTags(() => tags);
    }

    const addIngredient = () => {
        if (!!ingredientRef.current && ingredientRef.current.value.trim() !== '') {
            setIngredients(currentIngredients => [...currentIngredients, ingredientRef.current.value]);
        }
    };

    const reseIngredientsRef = () => {
        ingredientRef.current.value = '';
    }

    const resetForm = (): void => {
        reseIngredientsRef();
        methodRef.current.value = '';
        descriptionRef.current.value = '';
    }

    useEffect(() => {
        reseIngredientsRef();
    }, [ingredients]);

    return (
        <form className={styles.form} onSubmit={confirmHandler}>
            <div className={styles.control}>
                <label htmlFor='name'>שם מתכון</label>
                <input type='text' id='name' ref={descriptionRef} autoComplete="off" />
            </div>
            <div className={styles.control}>
                <label htmlFor='street'>מצרכים</label>
                <div>
                    <input type='text' id='street' autoComplete="off" ref={ingredientRef} style={{height: '2.2rem'}}/>
                    <Button variant="contained" onClick={addIngredient}>הוספה</Button>
                </div>
            </div>
            {
                !!ingredients.length &&
                <div className={styles.ingredients}>
                    <IngredientsList ingredients={ingredients} />
                </div>
            }

            <div className={styles.control} style={{paddingLeft: '1rem', paddingRight: '1rem'}}>
                <label htmlFor='method'>אופן הכנה</label>
                <textarea id='method'
                    style={{ width: '30vw', height: '20vh'}}
                    ref={methodRef}
                >
                </textarea>
            </div>
            <div className={styles.control}>
                <Tags submitTagsChange={handleTagsChange}/>
            </div>
            <div className={styles.actions}>
                <button className={styles.submit}>יצירת מתכון</button>
            </div>
        </form>
    );
}

export default CreateRecipe;