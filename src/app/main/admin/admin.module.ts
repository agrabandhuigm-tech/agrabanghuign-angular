import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MenuComponent } from './menu/menu.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { AddUserRoleComponent } from './add-user-role/add-user-role.component';
import { MenuCreateComponent } from './menu-create/menu-create.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    MenuComponent,
    UserRoleComponent,
    AddUserRoleComponent,
    MenuCreateComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
