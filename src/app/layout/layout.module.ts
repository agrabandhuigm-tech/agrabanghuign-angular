import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatComponentsModule } from '../modules/mat-module.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';


import { RouterModule } from '@angular/router';

import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonSharedModule } from '../common/common.module';




@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
   
    SidebarComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatComponentsModule,
    CommonSharedModule

  ],
  exports: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent

  ]
})
export class LayoutModule { }



