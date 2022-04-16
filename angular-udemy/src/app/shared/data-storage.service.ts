import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {

    constructor(private http: HttpClient, private recipeServices: RecipeService) { }

    storeRecipes(): void {
        const recipes = this.recipeServices.getRecipes();
        this.http.put('https://recipe-book-1166d-default-rtdb.firebaseio.com/recipes.json', recipes)
        .subscribe(_ => { });
    }

    fetchRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(
            'https://recipe-book-1166d-default-rtdb.firebaseio.com/recipes.json').pipe(
                map((recipes) => {
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                });
            }),
            tap(recipes => this.recipeServices.setRecipes(recipes)));
    }

}