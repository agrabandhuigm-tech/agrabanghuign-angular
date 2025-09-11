import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LoaderComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[LoaderComponent]
})
export class CommonSharedModule { }
