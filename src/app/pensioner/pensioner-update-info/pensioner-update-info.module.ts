import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PensionerUpdateInfoRoutingModule } from './pensioner-update-info-routing.module';
import { PensionerUpdateInfoComponent } from './pensioner-update-info.component';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { UpdatedFormDataListComponent } from './updated-form-data-list/updated-form-data-list.component';


@NgModule({
  declarations: [
    PensionerUpdateInfoComponent,
    BasicDetailsComponent,
    BankDetailsComponent,
    AddressDetailsComponent,
    UpdatedFormDataListComponent
  ],
  imports: [
    CommonModule,
    PensionerUpdateInfoRoutingModule,
    MatStepperModule,
    SharedModule,
    MatProgressSpinnerModule,
    FormsModule
  ]
})
export class PensionerUpdateInfoModule { }
