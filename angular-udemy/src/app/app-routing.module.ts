import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
   {
      path: 'recipes',
      loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
   },
   {
      path: 'shopping-list',
      loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
   },
   {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
   },
   { path: '', redirectTo: '/recipes', pathMatch: 'full' }
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })
   ],
   exports: [
      RouterModule
   ],
   declarations: [
   ]
})
export class AppRoutingModule { }
