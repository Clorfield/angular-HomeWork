import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable({providedIn: 'root'})
export class RecipeService {

    onRecipiesChanged = new Subject<Recipe[]>();
  
    private recipes: Recipe[] = [
        new Recipe(
            'A Test Recipe',
            'This is simple a test',
            'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_960,h_1200/k%2FPhoto%2FRecipes%2F2019-09-how-to-shrimp-alfredo%2FHT-Shrimp-Alfredo_103',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20)
            ]),
        new Recipe(
            'A Test Recipe',
            'Another simple a test',
            'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_960,h_1200/k%2FPhoto%2FRecipes%2F2019-09-how-to-shrimp-alfredo%2FHT-Shrimp-Alfredo_103',
            [
                new Ingredient('Bread', 2),
                new Ingredient('Meat', 1)
            ]),
        new Recipe(
            'A Test Recipe',
            'Third simple a test',
            'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_960,h_1200/k%2FPhoto%2FRecipes%2F2019-09-how-to-shrimp-alfredo%2FHT-Shrimp-Alfredo_103',
            [
                new Ingredient('Meat', 1),
                new Ingredient('Tomato', 2)
            ])
    ];

    constructor(private shoppingListService: ShoppingListService) { }

    getRecipe(index: number): Recipe {
        return this.recipes.slice()[index];
    }

    getRecipes(): Recipe[] {
        return this.recipes.slice();
    }
    
    addIngredientsToShoppingList(ingredients: Ingredient[]): void {
        this.shoppingListService.addIngredients(ingredients);
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

}