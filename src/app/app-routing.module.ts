import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component'; // Remplacez par le composant racine de votre application

const routes: Routes = [
  // Définissez vos routes ici
  // Exemple :
  // { path: '', component: HomeComponent },
  // { path: 'users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
