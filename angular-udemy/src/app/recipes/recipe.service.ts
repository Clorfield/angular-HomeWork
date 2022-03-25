import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable({providedIn: 'root'})
export class RecipeService {

    recipeSelected = new EventEmitter<Recipe>();
  
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

}