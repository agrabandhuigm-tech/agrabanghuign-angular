import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionerUpdateInfoComponent } from './pensioner-update-info.component';
import { UpdatedFormDataListComponent } from './updated-form-data-list/updated-form-data-list.component';

const routes: Routes = [

  // {
  //    path: 'pensionerUpdatedInfo',
  //     component: PensionerUpdateInfoComponent
  //    },

     {
      path: 'pensionerUpdatedInfoForm',
       component: PensionerUpdateInfoComponent
      },

    //  {
    //   path: 'updatedFormList',
    //    component: UpdatedFormDataListComponent
    //   },

    {
      path: '',
       component: UpdatedFormDataListComponent
      },

    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PensionerUpdateInfoRoutingModule { }
