import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
 path: '',
 loadChildren: () => import('./pensioner/pensioner.module').then(m => m.PensionerModule)
}];

@NgModule({  
  imports: [RouterModule.forRoot(routes,{useHash:true, relativeLinkResolution:'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
