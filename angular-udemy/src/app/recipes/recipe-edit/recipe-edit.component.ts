import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import * as RecipesAction from '../store/recipe.actions';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  get getIngredients(): AbstractControl[] {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = !!params['id'];
      this.initeForm();
    });
  }

  private initeForm(): void {
    let recipeName = '';
    let imgPath = '';
    let description = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipes').pipe(
        map(recipeState => recipeState.recipes.find((recipe, index) => {
          return index === this.id;
        }))
      ).subscribe(recipe => {
        recipeName = recipe.name;
        imgPath = recipe.imagePath;
        description = recipe.description;
  
        if (recipe['ingredients']) {
          for (let ing of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ing.name, Validators.required), 
                'amount': new FormControl(ing.amount,
                  [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ]) 
              })
            );
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(imgPath, Validators.required),
      'description': new FormControl(description, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  addIngredient(): void {
    (<FormArray>this.recipeForm.get('ingredients'))
      .push(new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      }));
  }

  onSubmit(): void {
    if (this.editMode) {
      this.store.dispatch(new RecipesAction.UpdateRecipe(
        {
          index: this.id, newRecipe: this.recipeForm.value
        })
      );
    } else {
      this.store.dispatch(new RecipesAction.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  deleteIngredient(index: number): void {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
