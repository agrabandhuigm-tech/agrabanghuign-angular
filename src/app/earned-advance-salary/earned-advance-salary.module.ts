import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";

import { FormsModule } from "@angular/forms";

import { AdvanceSalaryComponent } from "./advance-salary/advance-salary.component";
import { AdvanceWithdrawComponent } from "./advance-withdraw/advance-withdraw.component";
import { ServiceProviderWebsiteComponent } from "./service-provider-website/service-provider-website.component";
import { ServiceProviderWebsiteSuccessComponent } from "./service-provider-website-success/service-provider-website-success.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import { AuthGuard } from "src/app/auth/auth.guard";
// import { PieChartComponent } from "../../charts/pie-chart/pie-chart.component";
import { TrackTransactionComponent } from "./track-transaction/track-transaction.component";
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { EarnedAdvanceSalaryComponent } from "./earned-advance-salary.component";
import { CommonModalComponent } from "./common-modal/common-modal.component";
import { SharedModule } from "../shared/shared.module";
import { FAQDialogComponent } from './faq-dialog/faq-dialog.component';



const routes: Routes = [{
    path: '',
    component: EarnedAdvanceSalaryComponent,
  
    data: { type: 'user_dashboard' }
},
{
    path: 'earned-advance-salary',
    component: AdvanceSalaryComponent,
  
    data: { type: 'user_dashboard' }
},
{
    path: 'earned-advance-withdraw',
    component: AdvanceWithdrawComponent,
 
    data: { type: 'user_dashboard' }
},
{
    path: 'service-provider-website-component',
    component: ServiceProviderWebsiteComponent,
    data: { type: 'user_dashboard' }
},
{
    path: 'service-provider-website-response',
    component: ServiceProviderWebsiteSuccessComponent,
    data: { type: 'user_dashboard' }
},
{
    path: 'track-transaction',
    component: TrackTransactionComponent,
    data: { type: 'user_dashboard' }
},
{
    path: 'summary-report',
    component: SummaryReportComponent,
    data: { type: 'user_dashboard' }
}
]
@NgModule({
    declarations: [
        EarnedAdvanceSalaryComponent,
        CommonModalComponent,
        AdvanceSalaryComponent,
         AdvanceWithdrawComponent, 
         ServiceProviderWebsiteComponent,
         PieChartComponent,
         TrackTransactionComponent, 
         SummaryReportComponent, FAQDialogComponent],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: {} }
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        FormsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})

export class EarnedAdvanceSalaryModule {

}
