import { Injectable } from '@angular/core';
import { ApiEssService } from 'src/app/services/api-ess.service';


// import { faqdata } from './faqData';
// import { EmployeeMstV2Service } from 'src/app/services/api/employee-mst-v2.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotFaqService {
  faqdata: any = [];

  constructor(
    // private employeeMstV2Service: EmployeeMstV2Service,
    private pssService:ApiEssService ,
  ) { }

  getData(module:any = 2){
    return new Promise((resolve, reject) => {
      // const payload = {
      //   "catalogueId": 31,
      //   "params": [
      //     {
      //       "name": "V_MODULE_ID",
      //       "value": module
      //     },
      //     {
      //       "name": "selectSize",
      //       "value":0
      //     },
      //     {
      //       "name": "offsetSize",
      //       "value":0
      //     }
      //   ]
      // }
      // this.employeeMstV2Service.masterCatalogueData(payload).subscribe((res:any)=>{
      //   if(Array.isArray(res?.data.faqDtl)){
      //     this.faqdata = res?.data.faqDtl;
      //     this.faqdata.sort((a:any, b:any) => a.faqId - b.faqId);
      //   }
      //   resolve(this.faqdata)
      // },(error)=>{
      //   reject(error)
      // });


      const payload = {
        "moduleId": module
      }

      //  /home/feedback/v1.0/getChatBotFaq

      this.pssService.homePost("feedback/v1.0/getChatBotFaq",payload).subscribe((res:any)=>{
        if(Array.isArray(res?.data.faqDtl)){
          this.faqdata = res?.data.faqDtl;
          this.faqdata.sort((a:any, b:any) => a.faqId - b.faqId);
        }
        resolve(this.faqdata)
      },(error)=>{
        reject(error)
      });





    });

    // return faqdata

  }

}
