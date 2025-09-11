import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';


import {MatSliderModule} from '@angular/material/slider';

import { DatePipe } from '@angular/common';

import { QRCodeModule } from 'angularx-qrcode';
import { FileStatusComponent } from './file-status/file-status.component';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


const routes: Routes=[

    

 {path: 'fileStatus', component: FileStatusComponent},

    ]

@NgModule({

    declarations:[
        FileStatusComponent

  ],

    imports:[

         RouterModule.forChild(routes),
           MatStepperModule,
           SharedModule,
           MatProgressSpinnerModule,
           FormsModule
    ],
    providers:[
        DatePipe
    ]

})


export class PSNSelfService{}