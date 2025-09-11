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
import { LifeCertificateComponent } from './life-certificate/life-certificate.component';
import { LifeCertificateDetailsComponent } from './life-certificate-details/life-certificate-details.component';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes=[

    {
      path:'lifeOtherCertificate',
       component: LifeCertificateComponent
     },
     {
      path:'lifeCertificateDetail',
       component: LifeCertificateDetailsComponent
     },


    ]

@NgModule({

    declarations:[
      LifeCertificateComponent,
      LifeCertificateDetailsComponent
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


export class LifeCertificateModule{}