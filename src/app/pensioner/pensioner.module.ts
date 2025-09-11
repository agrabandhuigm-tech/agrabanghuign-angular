import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from '../pensioner/admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PdfpreviewComponent } from './pdfpreview/pdfpreview.component';
import { SelfserviceComponent } from './selfservice/selfservice.component';
import { PensionselfserviceComponent } from './selfservice/pensionselfservice/pensionselfservice.component';
import { MydashboardComponent } from './selfservice/pensionselfservice/mydashboard/mydashboard.component';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../shared/shared.module';
import { LifeOtherCertificatesComponent } from './selfservice/pensionselfservice/life-other-certificates/life-other-certificates.component';
 import { StatusComponent } from './selfservice/pensionselfservice/life-other-certificates/status/status.component';
import { MyRequestsComponent } from './selfservice/pensionselfservice/my-requests/my-requests.component';
import { MypensionComponent } from './selfservice/pensionselfservice/mypension/mypension.component';
import { PensionpayslipComponent } from './selfservice/pensionselfservice/mypension/pensionpayslip/pensionpayslip.component';
// import { PensionstatementComponent } from './selfservice/pensionselfservice/mypension/pensionstatement/pensionstatement.component';
import { PensioncalculatorComponent } from './selfservice/pensionselfservice/mypension/pensioncalculator/pensioncalculator.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { TaxesComponent } from './selfservice/pensionselfservice/taxes/taxes.component';
import { IncometaxdeclarationComponent } from './selfservice/pensionselfservice/taxes/incometaxdeclaration/incometaxdeclaration.component';
import { IncometaxcalculatorComponent } from './selfservice/pensionselfservice/taxes/incometaxcalculator/incometaxcalculator.component';
// import { NewvsoldtaxregimeComponent } from './selfservice/pensionselfservice/taxes/newvsoldtaxregime/newvsoldtaxregime.component';
import {MatSliderModule} from '@angular/material/slider';
import { HelpandsupportComponent } from './selfservice/pensionselfservice/my-requests/helpandsupport/helpandsupport.component';
import { EssrelatedreportsComponent } from './selfservice/pensionselfservice/essrelatedreports/essrelatedreports.component';
import { MyinformationComponent } from './selfservice/pensionselfservice/myinformation/myinformation.component';
import { CommonDialogueBoxComponent } from './common-dialogue-box/common-dialogue-box.component';
import { CommonSharedModule } from '../common/common.module';
import { CommutationRequestsComponent } from './selfservice/pensionselfservice/my-requests/commutation-requests/commutation-requests.component';
import { DatePipe } from '@angular/common';
import { InboxComponent } from './inbox/inbox.component';
//import { BankDetailsComponent } from './selfservice/pensionselfservice/myinformation/pss-correction-request/bank-details/bank-details.component';
//import { AddressDetailsComponent } from './selfservice/pensionselfservice/myinformation/pss-correction-request/address-details/address-details.component';
//import { ChangeMonthlyTreasuryComponent } from './selfservice/pensionselfservice/myinformation/pss-correction-request/change-monthly-treasury/change-monthly-treasury.component';
//import { ChangeProfileDetailsComponent } from './selfservice/pensionselfservice/myinformation/pss-correction-request/change-profile-details/change-profile-details.component';
import { RevisedAutoApprovedDialogComponent } from './selfservice/pensionselfservice/my-requests/revised-auto-approved-dialog/revised-auto-approved-dialog.component';
//import { FamilyDetailUpdateComponent } from './selfservice/pensionselfservice/myinformation/family-detail-update/family-detail-update.component';
import { UserMannualsComponent } from './user-mannuals/user-mannuals.component';
import { PensionerIdcardComponent } from './pension-related-request/pensioner-idcard/pensioner-idcard.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NotionalIncrementComponent } from './pension-related-request/notional-increment/notional-increment.component';
import { DashboardDialogComponent } from './dashboard-dialog/dashboard-dialog.component';
import { EsignModalComponent } from './esign-modal/esign-modal.component';


const routes: Routes=[

    {
    path: '',
    redirectTo: 'MyDashboard',
    pathMatch: 'full'
    },

    {path: 'MyDashboard', component: MydashboardComponent},
    {path: 'dashboard', loadChildren:() => import('./dashboard/dashboard.module').then(d => d.DashboardModule)},
    {path: 'admin', loadChildren:() => import('../pensioner/admin/admin.module').then(r => r.AdminModule)},
     {path: 'SelfService', component: SelfserviceComponent},
     {path: 'PensionSelfService', component: PensionselfserviceComponent},
     {path: 'LifeOtherCertificates', component: LifeOtherCertificatesComponent},
     {path: 'Status', component: StatusComponent},
     {path: 'MyRequests', component: MyRequestsComponent},
     {path: 'MyPension', component: MypensionComponent},
     {path: 'PensionPaySlip', component: PensionpayslipComponent},
    //  {path: 'PensionStatement', component: PensionstatementComponent},
     {path: 'PensionCalculator', component: PensioncalculatorComponent},
     {path: 'MyInformation', component: MyinformationComponent},
     {path: 'Taxes', component: TaxesComponent},
     {path: 'IncomeTaxDeclaration', component: IncometaxdeclarationComponent},
     {path: 'IncomeTaxCalculator', component: IncometaxcalculatorComponent},
    //  {path: 'NewVsOldTaxRegime', component: NewvsoldtaxregimeComponent},
     {path: 'Help&Support', component: HelpandsupportComponent},
     {path: 'EssRelatedReports', component: EssrelatedreportsComponent}, 
     {path: 'CommutationRequests', component: CommutationRequestsComponent}, 
     {path: 'inbox', component: InboxComponent},
   //  {path: 'BankDetails', component: BankDetailsComponent},
   //  {path: 'AddressDetails', component: AddressDetailsComponent}, 
   //  {path: 'ChangeMonthlyTreasury', component: ChangeMonthlyTreasuryComponent},
   //  {path: 'ChangeProfileDetails', component: ChangeProfileDetailsComponent},  
  //   {path: 'FamilyDetailUpdate', component: FamilyDetailUpdateComponent}, 
      
     {path: 'pensioneridcard', component: PensionerIdcardComponent} ,
     {
      path: 'life-certificate',
      loadChildren: () => import('./life-certificate/lifecertificate.module').then(m => m.LifeCertificateModule)
      
    },  {
      path: 'psn-self-service',
      loadChildren: () => import('./selfservice/pensionselfservice/PSNSelfServicemodule').then(m => m.PSNSelfService)      
    },
     {
        path: 'advance-pension',
        loadChildren: () => import('../earned-advance-salary/earned-advance-salary.module').then(m => m.EarnedAdvanceSalaryModule)
      },
     {
    path: 'pension-ess',
     loadChildren: () => import('./pension-related-request/registration.module').then((m) => m.RegistrationModule),
   },
   {path: 'user-manuals', component: UserMannualsComponent},
   {path: 'notional-increment', component: NotionalIncrementComponent},
 { path: 'pensionerUpdateInfo', loadChildren: () => import('./pensioner-update-info/pensioner-update-info.module').then(m => m.PensionerUpdateInfoModule) },
 {
  path: 'pss-correction',
  loadChildren: () => import('./selfservice/pensionselfservice/myinformation/pss-correction-request/PSSCorrection.module').then(m => m.PSSCorrection)
  
},

    ]

@NgModule({

    declarations:[
         PensionerIdcardComponent,
       PdfpreviewComponent,      
       SelfserviceComponent,
       PensionselfserviceComponent,
       MydashboardComponent,
       LifeOtherCertificatesComponent,
       MyRequestsComponent,
       MypensionComponent,
       PensionpayslipComponent,
       PensioncalculatorComponent,
       MyinformationComponent,
       TaxesComponent,
       IncometaxdeclarationComponent,
       IncometaxcalculatorComponent,
       HelpandsupportComponent,
       EssrelatedreportsComponent,
       CommonDialogueBoxComponent,
       StatusComponent,
       CommutationRequestsComponent,
       InboxComponent,
  
       RevisedAutoApprovedDialogComponent,

       UserMannualsComponent,
       DashboardDialogComponent,
       EsignModalComponent,
  ],

    imports:[

        RouterModule.forChild(routes),
        DashboardModule,
        AdminModule,
        MatOptionModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule ,
        MatSliderModule,  
        CommonModule,
        CommonSharedModule, 
        QRCodeModule,   
    ],
    providers:[
        DatePipe
    ]

})


export class PensionerModule{}