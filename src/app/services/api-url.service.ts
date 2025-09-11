import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
  mainurl:any='';
  devUrl:any;
  redirectionUrl: any = '';
  ifmshome='http://ifmsdev.rajasthan.gov.in/ifmshomesrvc/v1.0/sso';
  logoutUrl="http://ifmsdev.rajasthan.gov.in/ifmssso/";
url:any={
  
}
  constructor( private router:Router) { 
    let purl:string=this.router['location']._platformLocation.location.origin;

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
       "updateprofiledtls":"updateprofiledtls",
       "getaddressdetails":"getaddressdetails",
       "getfamilydetailsnew":"getfamilydetailsnew",
       "submitfamilydtlspensionerwise":"submitfamilydtlspensionerwise",
       "getfamilydtlspensionerwise":"getfamilydtlspensionerwise",
       "getallfamilydtlspensionerwise":"getallfamilydtlspensionerwise",
       "lifeCertificateDetails":"lifeCertificateDetails",
       "updatelifecertificatedtls":"updatelifecertificatedtls",
       "submitlifecertificateapprovedtls":"submitlifecertificateapprovedtls",
       "getpensionerbillstatus":"getpensionerbillstatus",
    }

    if(purl.includes("http://localhost") || purl.includes("http://ifmsdev.rajasthan.gov.in" ) || purl.includes("http://172.22.32.157:4200" ))
    {
      this.redirectionUrl = "http://ifmsdev.rajasthan.gov.in/"; 
      this.mainurl = "http://ifmsdev.rajasthan.gov.in/";
      this.devUrl="";
      this.ifmshome=this.mainurl+"ifmshomesrvc/v1.0/sso/";  
    }
    else if(purl.includes("https://ifms.rajasthan.gov.in" )) {
      this.redirectionUrl = "https://ifms.rajasthan.gov.in/ifmssso/"; 
      this.mainurl = "https://ifms.rajasthan.gov.in/";
      this.devUrl="";
      this.ifmshome=this.mainurl+"ifmshomesrvc/v1.0/sso/"; 
    }
    else if(purl.includes("https://ifmstest.rajasthan.gov.in" )) {
      this.redirectionUrl = "https://ifmstest.rajasthan.gov.in/"; 
      this.mainurl = "https://ifmstest.rajasthan.gov.in/";
      this.devUrl="/ifmssso/";
      this.ifmshome=this.mainurl+"ifmshomesrvc/v1.0/sso/";  
  }
  }  
}
  