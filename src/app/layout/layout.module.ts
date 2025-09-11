import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatComponentsModule } from '../modules/mat-module.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from "../app-routing.module";
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonSharedModule } from '../common/common.module';
import { PensionkitissueddialogComponent } from './sidebar/pensionkitissueddialog/pensionkitissueddialog.component';
import { ChatbotFaqComponent } from './chatbot-faq/chatbot-faq.component';


// import { NewfooterComponent } from './newfooter/newfooter.component';
// import { NewheaderComponent } from './newheader/newheader.component';
// import { TogglesidemenuComponent } from './togglesidemenu/togglesidemenu.component';
// import { FooterLandingComponent } from './footer-landing/footer-landing.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    SidebarComponent,
    PensionkitissueddialogComponent,
    ChatbotFaqComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatComponentsModule,
    CommonSharedModule
   
  ],
  exports:[
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    SidebarComponent
    
  ]
})
export class LayoutModule { }


// @NgModule({
//   declarations: [
//     LayoutComponent,
//     ContentComponent,
//     FooterComponent,
//     HeaderComponent,
//     NewfooterComponent,
//     NewheaderComponent,
//     TogglesidemenuComponent,
//     FooterLandingComponent
//   ],
//   imports: [
//     CommonModule,AppRoutingModule, MatIconModule, MatSidenavModule, MatButtonModule,SharedModule
//   ],
//   exports: [LayoutComponent]  
// })
// export class LayoutModule { }
