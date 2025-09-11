import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PssDashboardComponent } from '../pss-dashboard/pss-dashboard.component';


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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
