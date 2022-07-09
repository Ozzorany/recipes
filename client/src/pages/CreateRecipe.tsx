import { useRef, useState } from "react";
import IngredientsList from "../components/IngredientsList";
import Tags from "../components/Tags";
import { Recipe } from "../models/recipe.model";
import styles from './CreateRecipe.module.css';

function CreateRecipe({submitRecipe}: {submitRecipe : (recipe: Recipe) => {}}) {
    const [ingredients, setIngredients] = useState<string[]>([])
    const ingredientRef = useRef<any>();

    const confirmHandler = (event: any) => {
        event.preventDefault();
        const newRecipe: Recipe = { id: '1', description: 'das', ingredients: ingredients, method: 'coock well', tags: ['איטלקי'] };
        console.log(newRecipe);
        submitRecipe(newRecipe);
        

    };

    const addIngredient = () => {
        if (!!ingredientRef.current && ingredientRef.current.value.trim() !== '') {
            setIngredients(currentIngredients => [...currentIngredients, ingredientRef.current.value]);
            ingredientRef.current.value = '';
        }
    };

    return (
        <form className={styles.form} onSubmit={confirmHandler}>
            <div className={styles.control}>
                <label htmlFor='name'>שם מתכון</label>
                <input type='text' id='name' autoComplete="off" />
            </div>
            <div className={styles.control}>
                <label htmlFor='street'>מצרכים</label>
                <div>
                    <input type='text' id='street' autoComplete="off" ref={ingredientRef} />
                    <button onClick={addIngredient}>הוספה</button>
                </div>
            </div>
            {
                !!ingredients.length &&
                <div className={styles.ingredients}>
                    <IngredientsList ingredients={ingredients} />
                </div>
            }

            <div className={styles.control}>
                <label htmlFor='method'>אופן הכנה</label>
                <textarea id='method'
                    style={{ width: '30vw', height: '20vh' }}
                >
                </textarea>
            </div>
            <div className={styles.control}>
                <Tags />
            </div>
            <div className={styles.actions}>
                <button className={styles.submit}>יצירת מתכון</button>
            </div>
        </form>
    );
}

export default CreateRecipe;