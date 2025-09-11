import { FormArray} from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { retry, Subject } from 'rxjs';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-change-profile-details',
  templateUrl: './change-profile-details.component.html',
  styleUrls: ['./change-profile-details.component.scss']
})
export class ChangeProfileDetailsComponent implements OnInit {
  bankVerify:number=0;
  Single_files: any[] = [];
    userDetails: any ;
  advancedLoan: any[] = []; 
  registrationForm !: FormGroup;
  jointImageUrl: any = "assets/images/jointImg.jfif";
  imageUrl: any = "assets/images/userImg.png";
  @ViewChild('fileInput') el!: ElementRef;
  Personaldetail: any;
  residenceArray: any[] = [];
  officeArray: any[] = [];
  DepartmentAddress: any[] = []; 
  employeeId: any;
  config: AppConfig = new AppConfig();
  serviceDtls:any;

  dmsDocId:any;
   @Output() EmpData = new EventEmitter();
   @Output() uploadData = new EventEmitter();
   @Input() profileData: Subject<boolean>;

   @Input() docId: any;
   PersonalDetailsForm!: FormGroup; 

  constructor(
    private formbuilder: FormBuilder,
    public dialog: MatDialog,  
    public actRoute: ActivatedRoute,
    public load: LoaderService,
    public apiService: ApiService,
    public api:ApiService,
    private dashboardService:DashboardService,
    public apiurl: ApiUrlService,
    public common:CommonService
  ) {

  }
  user:any;
  PersonaldetailFamily:any;
  ngOnInit(): void {
    this.user = this.apiService.userInfo();
    console.log( "info",this.user)
    

    this.PersonalDetailsForm = this.formbuilder.group({
      janAdharId: new FormControl(''),
      employeeName:new FormControl(''),
      employeeId:new FormControl(''),
      ssoId:new FormControl(''),
      gender:new FormControl(''),
      dateOfBirth:new FormControl(''),
      height:new FormControl(''), 
      identificationMarks:new FormControl(''), 
      fatherName:new FormControl(''), 
      motherName:new FormControl(''), 
      maritalStatus:new FormControl(''), 
      spouseName:new FormControl(''), 
      disable:new FormControl(''), 
      percentageOfDisability:new FormControl(''), 
      bloodGroup:new FormControl(''), 
      email:new FormControl(''), 
      mobileNumber:new FormControl(''), 
      nationality:new FormControl(''), 
      religion:new FormControl(''), 
      pan:new FormControl(''),    
      pensionerId:new FormControl('') ,
      aadhaarNumber:new FormControl('')
    });

    this.getProfileDetails();
  }

  isFamilyPensioner:boolean=false;
  family:string="";
  getProfileDetails(){
     var url = this.apiurl.url.getprofiledetails;
     var data = {
       "ssoId":  this.user?.ssoId,
      // "psnId": this.Personaldetail.pensionerId,      
       
     };
     this.api.postpension(url, data).subscribe((res: any) => {
       console.log("result>>>", res);
       this.Personaldetail=res.data[res.data.length-1]; 
     
      console.log("Personaldetail==>>",this.Personaldetail);
      let isFamilyPensioner= this.Personaldetail?.isFamilyPensioner;
      console.log("isFamilyPensioner",isFamilyPensioner);
      if(isFamilyPensioner==1 || isFamilyPensioner!=undefined)
    {
      this.family="Family "
      this.isFamilyPensioner=true;
      let femData={
        "inType":7,
        "pensionerId":this.Personaldetail.pensionerId
      }
            this.apiService.postpension("pensionCorrectionProcess",femData).subscribe((res: any) => {
        this.load.hide();
          if(JSON.stringify(res).includes("pensionerId"))
          {
            this.PersonaldetailFamily=res.data[0];
            this.PersonalDetailsForm.get('pensionerId')?.patchValue(this.Personaldetail.pensionerId);
            this.PersonalDetailsForm.get('janAdharId')?.patchValue(this.PersonaldetailFamily?.janaadhaarId);
            this.PersonalDetailsForm.get('employeeName')?.patchValue(this.PersonaldetailFamily?.nameEng);
            this.PersonalDetailsForm.get('email')?.patchValue(this.PersonaldetailFamily?.email);
            this.PersonalDetailsForm.get('mobileNumber')?.patchValue(this.PersonaldetailFamily?.mobile);
            this.PersonalDetailsForm.get('aadhaarNumber')?.patchValue(this.Personaldetail?.adharRedId);
          
          }else
          {
            this.common.openErrorModal("Error in pensionCorrectionProcess service.","")
          }
      },(error)=>{
        this.load.hide();
        this.common.openErrorModal("Error in pensionCorrectionProcess service.","")
      })
    }
      else{
      
      this.PersonalDetailsForm.get('pensionerId')?.patchValue(this.Personaldetail.pensionerId);
      this.PersonalDetailsForm.get('janAdharId')?.patchValue(this.Personaldetail?.janAdharId);
      this.PersonalDetailsForm.get('employeeName')?.patchValue(this.Personaldetail?.employeeName);
    
      this.PersonalDetailsForm.get('ssoId')?.patchValue(this.Personaldetail?.ssoId);
      this.PersonalDetailsForm.get('gender')?.patchValue(this.Personaldetail?.gender);
      this.PersonalDetailsForm.get('documentType')?.patchValue(this.Personaldetail?.documentType);      
      this.PersonalDetailsForm.get('dateOfBirth')?.patchValue(this.Personaldetail?.dateOfBirth);
      this.PersonalDetailsForm.get('height')?.patchValue(this.Personaldetail?.height);
      this.PersonalDetailsForm.get('identificationMarks')?.patchValue(this.Personaldetail?.identificationMarks);
      this.PersonalDetailsForm.get('fatherName')?.patchValue(this.Personaldetail?.fatherName);
      this.PersonalDetailsForm.get('motherName')?.patchValue(this.Personaldetail?.motherName);
      this.PersonalDetailsForm.get('maritalStatus')?.patchValue(this.Personaldetail?.maritalStatus);
      this.PersonalDetailsForm.get('spouseName')?.patchValue(this.Personaldetail?.spouseName);
      this.PersonalDetailsForm.get('disable')?.patchValue(this.Personaldetail?.disable);
      this.PersonalDetailsForm.get('percentageOfDisability')?.patchValue(this.Personaldetail?.percentageOfDisability);
      this.PersonalDetailsForm.get('bloodGroup')?.patchValue(this.Personaldetail?.bloodGroup);
      this.PersonalDetailsForm.get('email')?.patchValue(this.Personaldetail?.email);
      this.PersonalDetailsForm.get('mobileNumber')?.patchValue(this.Personaldetail?.mobileNumber);
      this.PersonalDetailsForm.get('nationality')?.patchValue(this.Personaldetail?.nationality);
      this.PersonalDetailsForm.get('religion')?.patchValue(this.Personaldetail?.religion);
      this.PersonalDetailsForm.get('pan')?.patchValue(this.Personaldetail?.pan);
      this.PersonalDetailsForm.get('aadhaarNumber')?.patchValue(this.Personaldetail?.adharNo);
    }
      })  
      this.profileData.subscribe(v => {
        this.FinalverifyMobileFormSubmit()
       });  
   }
   isEmail:boolean=true;
    isMobile:boolean=true;
    isAddhar:boolean=true;
    isPan:boolean=true;
   onChange(data:any,i:any){
    console.log("data",data);
    if(i==1){
      if(this.isEmail){
        this.isEmail=false;
      }else{
        this.isEmail=true;
      }      
    }else if(i==2){
      if(this.isMobile){
        this.isMobile=false;
      }else{
        this.isMobile=true;
      }     
    }else if(i==3){
      if(this.isAddhar){
        this.isAddhar=false;
      }else{
        this.isAddhar=true;
      }
    } else if(i==4){
      if(this.isPan){
        this.isPan=false;
      }else{
        this.isPan=true;
      }
    }
   }



 // Final Submit Data After validate Otp // Start //
 FinalverifyMobileFormSubmit(){  
if(!this.isEmail && this.PersonalDetailsForm.controls['email'].value=='' )
{
  this.common.openErrorModal("Please enter email id","")
  return;
}
if(!this.isMobile && this.PersonalDetailsForm.controls['mobileNumber'].value=='' )
  {
    this.common.openErrorModal("Please enter Mobile Number","")
    return;
  }
  if(!this.isAddhar && this.PersonalDetailsForm.controls['aadhaarNumber'].value=='' )
    {
      this.common.openErrorModal("Please enter Aadhaar Number","")
      return;
    }
    if(!this.isPan && this.PersonalDetailsForm.controls['pan'].value=='' )
      {
        this.common.openErrorModal("Please enter PAN","")
        return;
      }



      if(!this.isEmail && this.PersonalDetailsForm.controls['email'].value==this.Personaldetail?.email)
        {
          this.common.openErrorModal("Please enter New email id","")
          return;
        }
        if(!this.isMobile && this.PersonalDetailsForm.controls['mobileNumber'].value==this.Personaldetail?.mobileNumber )
          {
            this.common.openErrorModal("Please enter New Mobile Number","")
            return;
          }
          if(!this.isAddhar && this.PersonalDetailsForm.controls['aadhaarNumber'].value==this.Personaldetail?.adharNo )
            {
              this.common.openErrorModal("Please enter New Aadhaar Number","")
              return;
            }
            if(!this.isPan && this.PersonalDetailsForm.controls['pan'].value==this.Personaldetail?.pan )
              {
                this.common.openErrorModal("Please enter New PAN","")
                return;
              }
              if(!this.docId )
                {
                  this.common.openErrorModal("Please Upload Document","")
                  return;
                }
    let updateList={"email":this.isEmail?"0":"1","mobileNumber":this.isMobile?"0":"1","aadhaarNumber":this.isAddhar?"0":"1","pan":this.isPan?"0":"1"};
  if (this.PersonalDetailsForm.valid ) {   

      var data1 = {
       "pensionerId":this.PersonalDetailsForm.controls['pensionerId'].value,      
       "email":this.PersonalDetailsForm.controls['email'].value,  
       "mobileNumber":this.PersonalDetailsForm.controls['mobileNumber'].value, 
       "pan":this.PersonalDetailsForm.controls['pan'].value,
       "aadhaarNumber" :this.PersonalDetailsForm.controls['aadhaarNumber'].value,
       "updateList":updateList,
       "docId":this.docId,
      }
      console.log("JSON for profile update",data1)

   
      const data = { value: data1 ,step: 4};
      console.log("monthly",data);
      this.EmpData.emit(data); 

   } 
  
 }  
 // Final Submit Data After validate Otp // End  // 
  // ****************************SERVICE DETAIL****************************************
  dateValue: any
  fetchServicesdetail() {
    let data = {
      employeeId: this.employeeId
    }
  }
  removeFile1(i: any) {
    this.advancedLoan.splice(i, 1);
  }
  // ****************************ADDRESS DETAIL****************************************
  iconCA: any;
  iconPA: any;
  iconOA: any;
  EMPAddress: any;
  EMP_doc: any;
  fetchAddressesEmp() {

    this.residenceArray = [];
    this.officeArray = [];
    this.DepartmentAddress = [];
    let data = {
      employeeId: this.employeeId
    };
   
  }



 
 


  //#endregion FAMILY DETAILS AND NOMINATION
  serviceRecord: any;
  de: any;
  file: any;
  fileName: any;
  datarecord: any;
  show1: string = 'A';
  destatus: boolean = false;

  // ********************Martial_Status
  file1: any;
  MartialStatus: any;

  isMdown: boolean = false;


  // ********************Disabled
  file2: any;
  Disabledfile: any;

  onChangeDisabled(event: any) {
    this.file2 = event.target.files[0];
    const employeeId = this.employeeId
    const docTypeId = "24";

  }

  removeDisabled() {
    this.file2 = null;
    this.Disabledfile = '';
  }
  // ********************Disabled
  file3: any;
  Retirementfile: any;
  isRe: boolean = false
  onRetirement(event: any) {



    let time1 = new Date();

    this.file = event.target.files[0];

    this.fileName = "RetiOrction" + time1.getHours() + time1.getMilliseconds().toString();
    this.fileName = this.fileName.replace(" ", "")
    const employeeId = this.employeeId
    const docTypeId = "15"
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString()
      data5 = data5.replace("data:application/pdf;base64,", "")
      console.log(data4);
      console.log(data4);
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docAttributes": [

        ],
        "data": [
          {
            "docTypeId": docTypeId,
            "docTypeName": "Retire_Order_Sanction",
            "docName": this.fileName,
            "docTitle": "Certificate",
            "content": data5
          }
        ]
      }
    };
    reader.readAsDataURL(this.file);

    this.updateProgress();
  }
  isDe: boolean = false
  noDECertificate(event: any) {



    let time1 = new Date();

    this.file = event.target.files[0];

    this.fileName = "node" + time1.getHours() + time1.getMilliseconds().toString();
    this.fileName = this.fileName.replace(" ", "")
    const employeeId = this.employeeId
    const docTypeId = "17"
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString()
      data5 = data5.replace("data:application/pdf;base64,", "")
      console.log(data4);
      console.log(data4);
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docAttributes": [

        ],
        "data": [
          {
            "docTypeId": docTypeId,
            "docTypeName": "Retire_Order_Sanction",
            "docName": this.fileName,
            "docTitle": "Certificate",
            "content": data5
          }
        ]
      }

    };
    reader.readAsDataURL(this.file);

    this.updateProgress();
  }
  removeRetirement() {
    this.file3 = null;
    this.Retirementfile = '';

  }
  // ********************Disabled
  file4: any;
  Chequefile: any;
  ischq: boolean = false
  onChangeCheque(event: any) {


    let time1 = new Date();

    this.file = event.target.files[0];

    this.fileName = "bankDoc" + time1.getHours() + time1.getMilliseconds().toString();

    const employeeId = this.employeeId
    const docTypeId = "18"
    const reader = new FileReader();
    var data4: any;
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString()
      data5 = data5.replace("data:application/pdf;base64,", "")
      console.log(data4);
      console.log(data4);
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docAttributes": [

        ],
        "data": [
          {
            "docTypeId": docTypeId,
            "docTypeName": "bankDoc",
            "docName": this.fileName,
            "docTitle": "Certificate",
            "content": data5
          }
        ]
      }
      console.log("data", data);


    };
    reader.readAsDataURL(this.file);

    this.updateProgress();
  }

  removeCheque() {
    this.file3 = null;
    this.Chequefile = '';

  }

 
  //#endregion BANK/TREASURY DETAIL

  //#region DOCUMENTS UPLOADED
  documentlist: any[] = []
  getAllUploadedDocumentDetailsByEmployeeCode() {
    let data = {
      "subModuleId": 4,
      "processId": 1,
      "employeeId": this.employeeId
    }

  }




  Single_CertificateList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;

      this.Single_files.push(item);
    }
    this.Single_Simulator(0);
  }
  Single_Delete(index: number) {
    this.Single_files.splice(index, 1);
  }



  Single_Simulator(index: number) {
    setTimeout(() => {
      if (index === this.Single_files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {

          if (this.Single_files[index].progress === 100) {
            clearInterval(progressInterval);

          } else {
            this.Single_files[index].progress += 10;
          }
        }, 50);
      }
    }, 500);
  }





  picData:any='';

  jointPic = (jointid:any) =>{
    console.log("",jointid)
    let data = {
      "type": "pension",
      "sourceId": 2,
      "docs": [
        {
          "docId":jointid
        }
      ]
    }
    console.log("single report data", data)
    this.apiService.postOr("wcc/getfiles", data).subscribe((res: any) => {
      //console.log("res", res.data.document[0].content);
      if (res.data.document[0].content) {
        this.jointImageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
      }
    })
  }



  progress: number = 0;
  noOfFiles: number = 35;
  completed: boolean = false;
  uploadProgress = 0;

  delay(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress() {
    this.completed = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay(35);
      this.progress = Math.round(i * n);

    }
    this.completed = true;
  }


  progress1: number = 0;
  noOfFiles1: number = 35;
  completed1: boolean = false;
  delay1(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  progress2: number = 0;
  noOfFiles2: number = 35;
  completed2: boolean = false;
  delay2(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress2() {
    this.completed2 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay2(35);
      this.progress2 = Math.round(i * n);
      console.log(i);
    }
    this.completed2 = true;
  }
  progress3: number = 0;
  noOfFiles3: number = 35;
  completed3: boolean = false;
  delay3(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress3() {
    this.completed3 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay3(35);
      this.progress = Math.round(i * n);
      console.log(i);
    }
    this.completed3 = true;
  }
  progress4: number = 0;
  noOfFiles4: number = 35;
  completed4: boolean = false;

  delay4(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  async updateProgress4() {
    this.completed4 = false;
    let n = 100 / this.noOfFiles;
    for (let i = 0; i <= this.noOfFiles; i++) {
      await this.delay4(35);
      this.progress4 = Math.round(i * n);
      console.log(i);
    }
    this.completed4 = true;
  }
  Complete: any;
  Comp: any;

  fil: any;

  onRemoveSpecialRequest(index: any) {
    const control = <FormArray>this.registrationForm?.get('addDynamicElement');
    control.removeAt(index);
  }
  get addDeduction() {
    return this.registrationForm?.get('addDeduction') as FormArray
  }
  DeductionItems = () => {
    this.addDeduction.push(
      this.formbuilder.group({
        deductionType: new FormControl(''),
        deductionName:new FormControl(''),
        deductionAmount: new FormControl(''),
        deductionHead: new FormControl('')
      })
    );
  }
  onRemoveDeduction(index: any) {
    const control = <FormArray>this.registrationForm?.get('addDeduction');
    control.removeAt(index);
  }

  get addAllowanceType() {
    return this.registrationForm?.get('addAllowanceType') as FormArray
  }

  AllowanceItems = () => {
    this.addAllowanceType.push(
      this.formbuilder.group({
        allowanceType: new FormControl(''),
        allowanceName:new FormControl(''),
        allowanceAmount: new FormControl(''),
        allowanceHead: new FormControl('')
      })
    );
  }

  onRemoveAllowance(index: any) {
    const control = <FormArray>this.registrationForm?.get('addAllowanceType');
    control.removeAt(index);
  }
  onSubmitAllowance() {
    // alert(JSON.stringify(this.registrationForm.value));
    // console.log("this.registrationForm.value",this.registrationForm.value)
  }
  get addWithHeld() {
    return this.registrationForm.get('addWithHeld') as FormArray
  }
  countWithheld:any=0
  WithHeldItems = () => {
   if(this.countWithheld==0)
   {
    this.addWithHeld.push(
      this.formbuilder.group({
        withHeldType: new FormControl(''),
        withHeldName: new FormControl(''),
        withHeldAmount: new FormControl(''),
        withHeldReason: new FormControl('')
      })
    );
    this.countWithheld=this.countWithheld+1;
   }else
   {
    alert("Only one entry allow");
   }
   
  }

  onRemoveWithHeld(index: any) {
    const control = <FormArray>this.registrationForm?.get('addWithHeld');
    control.removeAt(index);
  }

  serviceDetails(){    
  }
  showPic = (id:any) =>{
    let data = {
      
      "type": "pension",
      "sourceId": 2,
      "docs": [
        {
          "docId":id
        }
      ]
    }
    console.log("single report data", data)
    this.apiService.postOr("wcc/getfiles", data).subscribe((res: any) => {
      //console.log("res", res.data.document[0].content);
      if (res.data.document[0].content) {
        this.imageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
      }
     
    })
  }
  onFileSelected(event:any){

  }



 

  Allowance: any;
  deduction: any;
  WithHeldReasons: any;


  verifyMobileNo(){
    console.log(this.Personaldetail.mobileNumber)
    if(this.Personaldetail.mobileNumber)
    {
    let data={
      "ssoId":"RJ121212",
      "sourceId":"1",
      "processId":"18",
      "mobileNo":this.Personaldetail.mobileNumber,
      "ipAddress":"10.1.1.1"
    }
    this.apiService.postIfms('otp/otpGenerate', data).subscribe({
      next: res => {
        console.log("otp res data >>",res)
        this.verifyOtp(res);
       }
    })
  }
    else
    {
      alert("The Employee mobile number was not found");
    }
  }

  verifyOtp(res:any){
    const confirmDialog = this.dialog.open(CommonDialogueBoxComponent, {
      autoFocus: false,
      width: '350px',
      data: {
        action: '',
        id: 'otp',
        otpData:res,
        mobileNo:this.Personaldetail.mobileNumber
      },
    });

    confirmDialog.afterClosed().subscribe(data => {
      console.log("data",data);
      
      if (data.verified === 'Y') {        
        let dataVerified='Y';       
        if(this.bankVerify==1){
          this.FinalverifyMobileFormSubmit();
        }
        else if(this.bankVerify==2){
         
        }
        
       // return dataVerified;
     
       // this.FinalFormSubmit();
        
        
      }else{       
        alert("The OTP (One-Time Password) was not verified");
      //  let dataVerified='N';
        //return dataVerified;
       
      }
    })
  }
  uploadFile(event:any)
  {
    console.log("file",event);
    this.uploadData.emit(event); 
  }

  removeDoc()
  {
    this.docId=null;
  }

}


