import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent, AuthGuard } from './authorization';
import { ExplorerComponent } from './explorer';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ExplorerComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
