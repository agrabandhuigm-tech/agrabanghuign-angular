import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
// import { AppConfig } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TokenManagementService } from 'src/app/services/token-management.service';


interface progress {
  ind: number;
}

@Component({
  selector: 'app-pensioner-update-info',
  templateUrl: './pensioner-update-info.component.html',
  styleUrls: ['./pensioner-update-info.component.scss']
})
export class PensionerUpdateInfoComponent implements OnInit {

  @ViewChild(MatStepper) stepper1: MatStepper;

  progress1: number = 0;
  isMakercss: boolean = false;

  isNext:boolean[]=[];
  setepCount = 9;

  basicDetailsUserList: any
  basicDetails: Subject<boolean> = new Subject();

  bankDetailsUserList: Array<any> = [];
  bankDetails: Subject<boolean> = new Subject();

  addressUserList: Array<any> = [];
  address: Subject<boolean> = new Subject();

  checkbox1: boolean = false;
  checkbox2: boolean = false;
  checkbox3: boolean = false;
  checkbox1Checked: boolean = false;
  checkbox2Checked: boolean = false;
  checkbox3Checked: boolean = false;

  config:AppConfig=new AppConfig()

  pensionerData:any;

  masterDataReportApiData:any = [];

  constructor(public api: ApiService,private tokenInfo:TokenManagementService,private apiService: ApiService,private router: Router,private snackBar: SnackbarService,) { }


  empinfo: any = {};
  ngOnInit(): void {

    this.api.configMenu = { isload: true, dash: true }
   
    this.empinfo = this.tokenInfo.empinfoJWTService;
    console.log("empinfo",this.empinfo);

    this.apiService.configMenu = { IsShow: true };
    let details = sessionStorage.getItem('userDetails');
    let ifmsToken = sessionStorage.getItem('profileDetails');
    console.log(details);
    console.log(ifmsToken);
    
    if(details)
      {
        let data=JSON.parse(this.config.decrypt(details))
        // let data1=JSON.parse(this.config.decrypt(ifmsToken))
        // console.log("pensionerData",data1);
        this.pensionerData=data[0]
      }
    console.log("pensionerData",this.pensionerData);
   if(this.pensionerData?.pensionerId) {
    this.router.navigate(['pensionerUpdatedInfo'])
   }

    this.searchEmpCode()
// this.initialApi()
  }

  initialApi(){

    let obj = {
  
        // "pensionerId": 1647708,
        "pensionerId":  this.pensionerData?.pensionerId ? this.pensionerData?.pensionerId : '',
        // "pensionerId":  '',
        // "pensionerId":  50000,
        "inType": 2
  
    }
  
    this.apiService.postpension('submitPsnCommonRequest', obj).subscribe({
      // this.apiService.postpension('submitPsnCommonRequest', finalObject).subscribe({
       next: (res) => {
  
       console.log(res);
       console.log(res.data)
  
      //  this.initialApiKeydata = res.data[0].pensionerId;
      //  console.log(this.initialApiKeydata)
  
     
  
      //       let array:any[] = [];
  
      //         res.data.forEach((option:any ) =>{
  
      //   let parsedRequestDetails = JSON.parse(option.requestDetails)
  
      //   array.push(parsedRequestDetails);
        
      // }
      //        );
  
      //     console.log(array)
  
  
      //     this.dataSource.data = array
      //     console.log(this.dataSource)
      //     console.log(this.dataSource.data)
      
      if((res.data.length >0)&& res.data[0]?.pensionerId){
  
        this.router.navigate(['pensionerUpdatedInfo'])
  
      }else{
    
      }
  
  
   
           }
  
          })
  
  
  
   }
  searchEmpCode(){

    let data ={
      "page_number":1,
      "page_size":25,
      "zone":"ALL",
      "treasCode":"ALL",
      "key":"ppd.EMPLOYEE_CODE",
      "value1":this.pensionerData.employeeCode,
      "value2":"",
      "key1":"",
      "value3":"",
      "value4":"",
    }

      this.apiService.postpension('getMasterDataReport' ,data ).subscribe({
        next: (res) => {
       console.log(res.data);

     this.masterDataReportApiData = res.data[0]




   

     
        },
        error: (err) => {
          console.error('Error:', err);
        },
        complete: () => {
          console.log('Request completed');
        }
      });
      // this.load.hide();
    }




  Complete: any=0;
  Comp: any;
  progressFiles: progress[] = [];
  fil: any;
  onStepChange(stepper: MatStepper) {
    this.fil = stepper.selectedIndex
    this.progressFiles.push({
      ind: this.fil
    })
  //  {ind:1}
  // console.log(this.progressFiles)
    this.Comp = 12.50;

    for (let p of this.progressFiles) {
      if (p.ind == this.fil) {
        this.progress1 = this.progress1 + this.Comp;
        this.Complete = (this.Complete + 13);
        if (this.Complete > 100) {
          this.Complete = 100
          this.progress1 = 100
        }
      }
    }
  }

  savedata1(i:any)
  {
  
    // if(i==1 )
    // {
      
    //   this.isNext[0]=true
    //   this.personal.next(true);
    // }
    // else if(i==2 )
    // {
    //   this.isNext[1]=true
    //   this.service.next(true);
    // }
    if(i==1 )
    {
      this.isNext[1]=true
      // this.onStepChange1();
      this.basicDetails.next(true);
    }
    else if(i==2 )
    {
      this.isNext[1]=true
      this.address.next(true);
    }
    else if(i==3 )
    {
      this.isNext[1]=true
      this.bankDetails.next(true);
    }
 
    
   
    else if(i==4 )
    {

    
      // this.isNext[4]=true
      // this.family.next(true);
      this.onStepChange1();
    }
   
  }

  onStepChange1() {
    this.stepper1.next();
}

validate:boolean=false
getData = (data: any) => {

this.validate=data.validate;  
  this.setepCount = data.step;   

  switch (data.step) {
    case 1:
   
      if(this.validate)
      this.onStepChange1();
      break;


    }
  }


  savedata(){
   
    if(this.checkbox1){
      // this.savedata1();
      this.basicDetails.next(true);
    }
    if(this.checkbox2){
      this.address.next(true);
    }
    if(this.checkbox3){
      this.bankDetails.next(true);
    }


    /////  Final Full Form Data////
    let obj={
    "inType": 1,
  "pensionerId": this.pensionerData?.pensionerId,
  "createdUid": this.empinfo?.userId,
  "createdAid": this.empinfo?.userId,
  }

  ////////////

  // let obj: {
  //   inType: number;
  //   pensionerId: any;
  //   createdUid: any;
  //   createdAid: any;
  // } = {
  //   inType: 1,
  //   pensionerId: this.pensionerData?.pensionerId,
  //   createdUid: this.empinfo?.userId,
  //   createdAid: this.empinfo?.userId
  // };

    if(this.checkbox1){
      if(this.basicDetailsUserList.invalid){
        return
      }
     obj={
      ...obj,
              //  ...this.basicDetailsUserList.value,

              // "personalDetails": {
              //    ...this.basicDetailsUserList.value
              // }

              ...{ personalDetails: this.basicDetailsUserList.value }

       }
      //  this.basicDetails.next(true);
 }
 if(this.checkbox2){
  
   obj={
    ...obj,
    //  ...this.addressUserList,

    // "addressDetails": {
    //   "employeeAddresses": [
    //     {
    //       ...this.addressUserList
    //     }
    //   ]
    // }

    ...{ addressDetails: { employeeAddresses: [this.addressUserList] } }


   }
  //  this.address.next(true);
 }

 if(this.checkbox3){
   obj={
    ...obj,
    //  ...this.bankDetailsUserList,

    // "bankTreasuryDetails": {
    //   ...this.bankDetailsUserList
    // }

    // Add or replace bankTreasuryDetails with spread operator
    ...{ bankTreasuryDetails: this.bankDetailsUserList }

   }

  //  this.bankDetails.next(true);
  

   // Wrapping the final object in the desired structure
    //  let finalObject = {
    //    "data": obj
    //     };

    //  console.log("final data >>>>>>>>>>>",finalObject);

     
     }
         /////////////////

        //  {
         //   "data": {
          //       "personalDetails": {
        //       }
        //     }
         //   }

      ///////////////
    
 
        console.log("final data >>>>>>>>>>>",obj);
           //  console.log("final data >>>>>>>>>>>",finalObject);
          /////////////////////

          this.apiService.postpension('submitPsnCommonRequest', obj).subscribe({
            // this.apiService.postpension('submitPsnCommonRequest', finalObject).subscribe({
             next: (res) => {
      
             console.log(res);

             let parseData = JSON.parse(res?.data[0].message)
             console.log(parseData)


             if(parseData.message == "Pensioner ID already inserted"){
              this.snackBar.show(parseData.message, 'success');

             }else{
              this.updatedFormList();
             }
         
             }
            })
 
  }


  changeValue(checkboxName: string, event: any) {
    const isChecked = event.checked;
   // Set conditions based on checkbox values
   if (checkboxName === 'basicDetails') {
    this.checkbox1Checked = isChecked;
    if (isChecked) {
      this.checkbox1 = true;
    }
  } else if (checkboxName === 'address') {
    this.checkbox2Checked = isChecked;
    if (isChecked) {
      this.checkbox2 = true;
    }
  } else if (checkboxName === 'bankDetails') {
    this.checkbox3Checked = isChecked;
    if (isChecked) {
      this.checkbox3 = true;
    }
  }
  }


 ///////  Basic Details //////

 getBasicDetailsuser = (data: any) => {
  this.basicDetailsUserList = data;
  console.log("data22222222>>>>>>>" , this.basicDetailsUserList)
};

 ///////  Bank Details //////

 getBankDetailsuser = (data: any) => {
  this.bankDetailsUserList = data;
  console.log("data22222222>>>>>>>" , this.bankDetailsUserList)
};



  /////  Address Details ///////
  
getAddressuser = (data: any) => {
  this.addressUserList = data;
  console.log("data22222222>>>>>>>" , this.addressUserList)
  


};


///////// redirect to updatedFormDataList Component //////////

updatedFormList(){

  if(this.checkbox1){
    // this.savedata1();
    this.router.navigate(['pensionerUpdatedInfo'])
  }
  if(this.checkbox2){
    this.router.navigate(['pensionerUpdatedInfo'])
  }
  if(this.checkbox3){
    this.router.navigate(['pensionerUpdatedInfo'])
  }

  // this.router.navigate(['pensionerUpdatedInfo/updatedFormList'])


}

}
