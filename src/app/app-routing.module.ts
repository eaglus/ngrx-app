import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent, AuthGuard } from './authorization';
import { CallExplorerComponent, CallCardComponent } from './callExplorer';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: CallExplorerComponent, canActivate: [AuthGuard] },
  { path: 'call/:id', component: CallCardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
