//import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-incometaxdeclaration',
//   templateUrl: './incometaxdeclaration.component.html',
//   styleUrls: ['./incometaxdeclaration.component.scss']
// })
// export class IncometaxdeclarationComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }



import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//import { PensionServiceService } from 'src/app/services/pension-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-incometaxdeclaration',
  templateUrl: './incometaxdeclaration.component.html',
  styleUrls: ['./incometaxdeclaration.component.scss']
})

export class IncometaxdeclarationComponent implements OnInit {

  resultNomineeData:any=[{
    nameOfNominee: '',
    relationName: '',
    relationshipId: '', 
    share: ''
  }
  ];
  nomineelist:any=[];
  nomineeArray:any=[];
 
  selectedNominee: any = [];
  isNominee: boolean = false; 
  searchEmployeeForm : any = FormGroup;
  currentDate: Date = new Date();
  totalAmount: number = 0;
  selectedPerson: any = [];
  parse!: {
    dateInput: 'LL';
  };
  display!: {
    dateInput: 'DD/MM/YYYY';
  };
  otherThenWife = '';
  rType='';
  loading = false;
  resultServiceData:any = '';
  resultEmpData: any = '';
  documentListData: any = [];
  documentId: any = '';
  isSubmitted: boolean = false;
  isSearch: boolean = false;
  detypelist:any;
  Penalty:any;
  // Penalty_Type:any
  Remark:any;
  resultEmpDeData:any;
  datepipe: any;
  employeeId : any;
  constructor(
    private formbuilder: FormBuilder,
   // private _Service: PensionServiceService,
   // private DatePipe: DatePipe,
    private fb:FormBuilder,
    //private datePipe: DatePipe,
   
  ) {

//     this.searchEmployeeForm = this.formbuilder.group({ 
//       retirementTypes: new FormControl('',Validators.required),
//       //retirementRemarks: new FormControl('', Validators.required),
//      // attachDocument: new FormControl('',Validators.required ),
//       deTypeId:new FormControl(''),
//       //lastWorkingDate: new FormControl('', Validators.required),  
//       empCode: new FormControl(''),     
//       Penalty: new FormControl(''),     
//       Penalty_Type: new FormControl(''),     
//       Remark: new FormControl(''),  
//       V_createbyU :new FormControl(''),
//       V_createbyA : new FormControl(''), 
//       employeeId :new FormControl(''), 
//       //employeeId : this.resultEmpData.employeeId.toString(),  

//       //nominee: this.fb.array([]),  
//       // empDocumentArray: this.fb.array([])
//     });  
   }

  ngOnInit(): void {  

    this.searchEmployeeForm = this.formbuilder.group({ 

      
      retirementTypes: new FormControl('',Validators.required),


      Year: ['', Validators.required],
      Name: ['', Validators.required],
      Taxregime: ['', Validators.required],
      Month: ['', Validators.required],

      
      //retirementRemarks: new FormControl('', Validators.required),
     // attachDocument: new FormControl('',Validators.required ),
      deTypeId:new FormControl(''),
      //lastWorkingDate: new FormControl('', Validators.required),  
      empCode: new FormControl(''),     
      Penalty: new FormControl(''),     
      Penalty_Type: new FormControl(''),     
      Remark: new FormControl(''),  
      V_createbyU :new FormControl(''),
      V_createbyA : new FormControl(''), 
      employeeId :new FormControl(''), 
      //employeeId : this.resultEmpData.employeeId.toString(),  

      //nominee: this.fb.array([]),  
      // empDocumentArray: this.fb.array([])
    }); 
    
    //alert();
   // alert()
  // this.getDetype();
  // this.getPenaltyTypes();
   // console.log("searchEmployeeForm==>>>",this.searchEmployeeForm);   
  }
  get searechEmpFormControl() {
    return this.searchEmployeeForm.controls;
  }

// getDetype()
// {  
//   let data ={      
//   }
//   this._Service.postdetype(data, "getDeTypes").subscribe({
//     next: (res:any) => {     
//       if (res.status = "SUCCESS") {    
      
// this.detypelist=res.data;

// console.log("this.detypelist",this.detypelist)
//       }
//     },    
//     error: (err) => {    
    
//       let errorObj = {
//         message: err.message,
//         err: err,
//         response: err
//       }
//     }
//   })
// }


Markdetyp:boolean=false
showHidemarkde(val: any) {
  if (val === 1) {
    this.Markdetyp = true;
  } else {
    this.Markdetyp = false;
  }
}
  isPenalty:boolean=false
  showHideRemark(val: any) {
    if (val === 1) {
      this.isPenalty = true;
    } else {
      this.isPenalty = false;
    }
  }
  penaltytypelist:any;
//   getPenaltyTypes() {
//     let data ={      
//     }
//     this._Service.postdetype(data, "getPenaltyTypes").subscribe({
//       next: (res:any) => {
//         if (res.status = 200) {
        
// this.penaltytypelist=res.data;

//         }
//       },
//       error: (err) => {
//         let errorObj = {
//           message: err.message,
//           err: err,
//           response: err
//         }
//       }
//     })
//   }

  selectNomineePerson(item:any, i: number){
    let nomineeArray=(this.searchEmployeeForm.get('nominee')as FormArray);
    let nomineeArrayValue=nomineeArray.value;
      if(nomineeArrayValue[i].nomineePersion){
        this.totalAmount += Number(nomineeArrayValue[i].share);
        if(this.totalAmount>100){
          alert("total shares can't be greater than 100 percent");
          nomineeArrayValue[i].nomineePersion=false;
          this.selectedPerson[i] = null;
         }
    }else{
      this.totalAmount -= Number(nomineeArrayValue[i].share);
    }
    console.log(this.totalAmount)
   }

  // searchEmpBasiceDetailsApi(empCode: any ){
  //   this.searchEmpBasicedeDetailsApi(empCode)
    
  //   this.isSearch = true;
  //    if(empCode){
  //     this.loading = true;
  //     let data = {
  //       "employeeId": empCode
  //     }
      
  //     this._Service.postRequestpension(data, "getEmployeeDetails").subscribe({
  //       next: (res:any) => {
          
  //         this.loading = false;
  //         if (res.status = "SUCCESS") {
  //           if(res.data.Message){
  //             alert(res.data.Message);
  //           }else if(res.data){
  //             this.resultEmpData = res.data.employeePersonalDetail;
  //             this.resultServiceData = res.data.employeeServiceDetails;
  //             let resultFamilyData: any = res.data.employeeFamilyDetails.employeeFamilyDetails;
  //             console.log(resultFamilyData);
  //             this.resultNomineeData = resultFamilyData?.nomineeDetails;
  //             console.log(this.resultNomineeData);
  //           }
  //         }else{
  //           alert('Something went wrong');
  //           this.resultEmpData = '';
  //           this.resultServiceData = ''; 
  //         }
  //       },
  //       error: (err) => {
  //         this.loading = false;
  //         this.resultEmpData = '';
  //         this.resultServiceData = ''; 
  //         if(err.description){
  //           alert(err.description);
  //         }
  //       }
  //     })
  //   }
  // }

  //  Employee Mark Detail's with Api_23-05-2023 

//   searchEmpBasicedeDetailsApi(empCode: any ){
//     this.isSearch = true;
//      if(empCode){
//       this.loading = true;
//       let data = {
//         "employeeCode": empCode
//       }    
      
//       this._Service.postRequestpensionTest(data, "getdedetails").subscribe({
//         next: (res:any) => {
//           this.loading = false;
//           console.log("resultEmpDeData===>",res);
//           if (res.status = "SUCCESS") {
//             if(res.data.Message){
//               alert(res.data.Message);
//             }else if(res.data){
//               this.resultEmpDeData = res.data[0]; 

//              if(this.resultEmpDeData.deTypeId) 
//              {
//               this.showHideRemark(1);
//               this.searchEmployeeForm.patchValue({                  
//                 Penalty:"1",
//                 retirementTypes:"1"
//                 });
//              }

// var dateParts = res.data[0].deStartDt.split("-");
// //var dateParts = res.data[0].deEndDt.split("-");
// var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
// //alert (this.resultEmpDeData.deTypeId);
// console.log("date1",this.searchEmployeeForm.value)
// this.Markdetyp = false;
// if(this.resultEmpDeData.deTypeId>0){
//   this.Markdetyp = true;
// }
//                  this.searchEmployeeForm.patchValue({                  
//                     //lastWorkingDate: dateObject,  // 29 - 05 - 2023                
 
//                     deTypeId:parseInt(this.resultEmpDeData.deTypeId), 
                    
//                     Penalty_Type:parseInt(this.resultEmpDeData.penaltyType), 

//                     Remark:this.resultEmpDeData.deRemark,
//                   });
//                // console.log("resultEmpDeDatafrom===>", this.searechEmpFormControl.lastWorkingDate);           
           
//             }
//           }else{
//             alert('Something went wrong');
//             this.resultEmpDeData = '';           
//           }
//         },
//         error: (err) => {
//           this.loading = false;
//           this.resultEmpDeData = '';         
//           if(err.description){
//             alert(err.description);
//           }
//         }
//       })
//     }
//   }
  // End
 

  onSubmit(){
    this.isSubmitted = true;
    let jsonData: any = {}; 
    let nomineeRowArray:any[] = [];

    console.log(this.searchEmployeeForm.value);

    return false;
    
//     let postData={
//       "retirementRemarks":this.searchEmployeeForm.value.retirementRemarks,
//     }
// console.log(postData);

    // if(this.searchEmployeeForm.valid){
    //   if(confirm('Are you sure you want to submit')){
    //     let nomineeData= this.searchEmployeeForm.value.nominee;
    //     nomineeRowArray =  nomineeData.filter((data: any) => data['nomineePersion'] == true);
    //       jsonData ={
    //         "employeeId":this.resultEmpData.employeeId.toString(),
    //         "employeeCode": this.searchEmployeeForm.get('empCode').value.toString().trim(),
    //         "dateOfRetirement":  this.datePipe.transform(this.resultEmpData.dateOfRetirement, 'yyyy-MM-dd'),
    //         "lastWorkingDate": this.datePipe.transform(this.searchEmployeeForm.value.lastWorkingDate, 'yyyy-MM-dd'),
    //         "retirementTypes":this.searchEmployeeForm.value.retirementTypes,
    //         "documentId":this.documentId
    //       }
          
    //       jsonData['nominee']=nomineeRowArray;
    
    //       this._Service.postPssRequest(jsonData, "savepensionermark").subscribe({
    //         next: (res:any) => {
    //           if (res.status == "SUCCESS") {
    //             let data = JSON.parse(res.data);
    //             alert("Your request submitted successfully. Your Mark Pension Id is " +data.markPnsId);
    //             this.searchEmployeeForm.reset();
    //             this.resultEmpData = '';
    //             this.resultServiceData = '';
    //             this.isSearch = false;
    //             this.isSubmitted = false;
    //           }else{
    //             alert("Something went wrong");
    //           }
    //         },
    //         error: (err) => {
    //           alert("Something went wrong");
    //           let errorObj = {
    //             message: err.message,
    //             err: err,
    //             response: err
    //           }
    //         }
    //       })
    //   }

    // }
  }
}



