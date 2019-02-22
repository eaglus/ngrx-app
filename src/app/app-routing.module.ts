import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { LoginComponent } from './authorization';
import { ExplorerComponent } from './explorer';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ExplorerComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
