import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';






import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

import { CommonSharedModule } from '../common/common.module';

import { DatePipe } from '@angular/common';
import { MydashboardComponent } from './mydashboard/mydashboard.component';
import { PdfpreviewComponent } from './pdfpreview/pdfpreview.component';
import { CommonDialogueBoxComponent } from './common-dialogue-box/common-dialogue-box.component';







const routes: Routes = [

    {
        path: '',
        redirectTo: 'MyDashboard',
        pathMatch: 'full'
    },

    { path: 'MyDashboard', component: MydashboardComponent }
]

@NgModule({

    declarations: [
        MydashboardComponent,
        PdfpreviewComponent,
        CommonDialogueBoxComponent
    ],

    imports: [

        RouterModule.forChild(routes),
        MatOptionModule,
        MatFormFieldModule,
        MatAutocompleteModule,

        FormsModule,
        ReactiveFormsModule,
        MatSliderModule,
        CommonModule,
        CommonSharedModule,
        SharedModule
    ],
    providers: [
        DatePipe
    ]

})


export class mainModule { }