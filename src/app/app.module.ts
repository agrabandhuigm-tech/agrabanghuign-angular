import { LayoutModule } from './layout/layout.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NumberOnlyDirective } from './directives/common.directive';
import { AuthInterceptorInterceptor } from './interceptor/auth-interceptor.interceptor';

const routes: Routes=[   
 
   {path: 'MatAutocomplete', component: MatAutocompleteModule},
  ]

@NgModule({
  declarations: [AppComponent],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    MatAutocompleteModule,
    FormsModule,
    
  ],
  providers: [  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }











