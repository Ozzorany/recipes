import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import IngredientsList from "../components/IngredientsList";
import Tags from "../components/Tags";
import styles from './CreateRecipe.module.css'

function CreateRecipe() {
    const [ingredients, setIngredients] = useState<string[]>([])
    const ref = useRef<any>();

    const confirmHandler = (event: any) => {
        event.preventDefault();
    };

    const addIngredient = () => {
        if (!!ref.current && ref.current.value.trim() !== '') {
            setIngredients(currentIngredients => [...currentIngredients, ref.current.value]);
            ref.current.value = '';
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
                    <input type='text' id='street' autoComplete="off" ref={ref} />
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