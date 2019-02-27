import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule,
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule,
  MatTableModule
} from '@angular/material';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { reducers, metaReducers } from './reducers';
import { LoginComponent, AuthorizationEffects } from './authorization';
import { CallExplorerComponent, CallCardComponent, CallExplorerEffects } from './callExplorer';
import { getInitialState, LocalStorageEffects } from './localStorage';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallExplorerComponent,
    CallCardComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AppRoutingModule,

    StoreModule.forRoot(
      reducers, 
      { 
        metaReducers,
        initialState: getInitialState()
      }
    ),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    EffectsModule.forRoot([AuthorizationEffects, LocalStorageEffects, CallExplorerEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
