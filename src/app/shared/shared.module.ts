import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule ,HttpClient } from '@angular/common/http';
import { OtpWindowComponent } from './otp-window/otp-window.component';
import { MatComponentsModule } from '../modules/mat-module.module';
import { NgOtpInputModule } from 'ng-otp-input';

//import { CommonTableComponent } from './common-table/common-table.component';

/* Extra */
import { LoaderInterceptor } from '../interceptors/loader.interceptor.spec';

/* Angular Material Imports */
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule } from '@angular/material/button';
import {MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatNativeDateModule} from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatDividerModule} from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

/* Other Module Imports */

import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatToolbarModule } from '@angular/material/toolbar';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const Mat = [
  MatCheckboxModule,
  MatSelectModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatAutocompleteModule,
  MatExpansionModule,
  FormsModule,
  MatIconModule,
  MatTooltipModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDatepickerModule,
  MatStepperModule,
  MatSidenavModule,
  MatMenuModule,
  MatSortModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatDividerModule,
  MatMomentDateModule,
  MatTabsModule,
  MatListModule,
  MatSnackBarModule,
  MatIconModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
  MatInputModule,
  MatTableModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatDividerModule,
  MatIconModule,
  MatTooltipModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  ReactiveFormsModule,
  FormsModule,
  MatDatepickerModule,
  MatStepperModule,
  MatSidenavModule,
  // datatable
  MatSortModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatNativeDateModule,
  HttpClientModule,
 
  MatToolbarModule,
  MatSnackBarModule,
  MatMenuModule,
  MatChipsModule,
  MatTabsModule,
  MatListModule,
  CommonModule,
  
]

@NgModule({
  declarations: [
    
    OtpWindowComponent,
    
  ],
  imports: [
    CommonModule,
    MatComponentsModule,
    NgOtpInputModule,
    ReactiveFormsModule,
    FormsModule,
    MomentDateModule,
    TranslateModule.forRoot(),
    Mat
  ],
  exports:[Mat],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true,
 }
],
})
export class SharedModule { }
