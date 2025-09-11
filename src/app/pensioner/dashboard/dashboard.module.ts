import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { PssDashboardComponent } from '../pss-dashboard/pss-dashboard.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'pssdashboard',
    component: PssDashboardComponent
    },
 
];

@NgModule({
  declarations: [DashboardComponent,
    PssDashboardComponent,
  
    ],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    SharedModule,
    
    MatExpansionModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule
   
   
],
})
export class DashboardModule { }
