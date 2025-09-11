import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
url:any={
  
}
  constructor() { 
    this.url={
      "updatephotoid":"updatephotoid",
       "pensionerInfo":"getpensionerpersonaldetails",
       "getPsnKit":"wcc/getfiles",
       "getppodetails":"getppodetails",
       "getprofiledetails":"getprofiledetails",
       "getbankaccountdetails":"getbankaccountdetails",       
       "bankdetailsbyifsc":"bankdetailsbyifsc",
       "getfamilydetails":"getfamilydetails",     
       "getservicerecord":"getservicerecord",   
       "updatebankdetails":"updatebankdetails",
       "getpensionkitdtls":"getpensionkitdtls",
       "getSchemeNomineeDetails":"getSchemeNomineeDetails",
       "updatefamilydetails":"updatefamilydetails",
       "nomineeschemedtls":"nomineeschemedtls" ,
       "submitrevisedcommutation":"submitrevisedcommutation",
       "fetchpensionerdtls":"fetchpensionerdtls",
       "updateaddressservice":"updateaddressservice",
       "updateprofiledtls":"updateprofiledtls"
    }
  }  
}
  