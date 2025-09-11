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

import { SharedModule } from 'src/app/shared/shared.module';
import { PssCorrectionRequestComponent } from './pss-correction-request/pss-correction-request.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { ChangeMonthlyTreasuryComponent } from './change-monthly-treasury/change-monthly-treasury.component';
import { ChangeProfileDetailsComponent } from './change-profile-details/change-profile-details.component';


const routes: Routes=[

 {
      path:'',
       component: PssCorrectionRequestComponent
     },

    ]

@NgModule({

    declarations:[
        BankDetailsComponent,
        AddressDetailsComponent,
        PssCorrectionRequestComponent,
        ChangeMonthlyTreasuryComponent,
        ChangeProfileDetailsComponent
  ],

    imports:[

        RouterModule.forChild(routes),
       SharedModule,
        MatOptionModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule ,
        MatSliderModule,  
        CommonModule,
        QRCodeModule,   
    ],
    providers:[
        DatePipe
    ]

})


export class PSSCorrection{}