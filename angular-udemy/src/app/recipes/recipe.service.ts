import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable({providedIn: 'root'})
export class RecipeService {

    onRecipiesChanged = new Subject<Recipe[]>();


    private recipes: Recipe[] = [];

    constructor(
        private store: Store<fromShoppingList.AppState>) { }

    getRecipe(index: number): Recipe {
        return this.recipes.slice()[index];
    }

    getRecipes(): Recipe[] {
        return this.recipes.slice();
    }
    
    addIngredientsToShoppingList(ingredients: Ingredient[]): void {
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe): void {
        this.recipes.push(recipe);
        this.onRecipiesChanged.next(this.recipes);
    }

    updateRecipe(index: number, newRecipe: Recipe): void {
        this.recipes[index] = newRecipe;
        this.onRecipiesChanged.next(this.recipes);
    }

    deleteRecipe(index: number): void {
        this.recipes.splice(index, 1);
        this.onRecipiesChanged.next(this.recipes);
    }

    setRecipes(recipes: Recipe[]): void {
        this.recipes = recipes;
        this.onRecipiesChanged.next(this.recipes);
    }

}