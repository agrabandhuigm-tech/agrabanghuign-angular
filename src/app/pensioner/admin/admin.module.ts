import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MenuComponent } from './menu/menu.component';



@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
   
  ]
})
export class AdminModule { }
