import { FormArray} from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper';
import { log } from 'console';
import { RedirectService } from 'src/app/services/redirect.service';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { retry } from 'rxjs';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { MatDrawer,} from '@angular/material/sidenav';
import { ApiService } from 'src/app/services/api.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material/table';


interface City {
  value: string,
  viewValue: string
}
interface gap {
  date: string;
}
interface count {
  sum: number;
}
interface document {
  file: string;
}
interface document_id {
  id: number;
}
interface progress {
  ind: number;
}
interface document_id_list {
  document_name: string;
  size: string,
  id: number
}
export interface PeriodicElement {
 
  name: string;
  title: number;
  sex: string;
  symbol: string;
  imagePath: string;
  relation: string;
  main: string;
  alternate: string;


}

@Component({
  selector: 'app-myinformation',
  templateUrl: './myinformation.component.html',
  styleUrls: ['./myinformation.component.scss']
 
})


export class MyinformationComponent implements OnInit {
  displayedColumns: string[] = ['nomineeName','relation','percentShare','altPrecentShare'];
  dataSource!: MatTableDataSource<any>;
  bankVerify:number=0;

     gratuity_Arr: any;
   commutation_Arr: any;
   arrear_Arr: any;
  bankForm!: FormGroup; 
  serviceForm!: FormGroup; 
 
  //Personaldetail:any ;
  exMilitaryMan: any;
  isCommutation: boolean = false;
  removeDoc: boolean[] = []
  is_Disabled: boolean = true;
  //#region  BANK/TREASURY VARIABLES
  Banklist: any = [];
  //#endregion BANK/TREASURY VARIABLES
  serviceRecordForm !: FormGroup;
  //#region LOAN AND ADVANCE
  loanAndAdvancesDetails: any;
  payload_summary: any;
  //#endregion LOAN AND ADVANCE
  Pension_Commutation: any;
  //#region CALCULATION VARIABLES
  Calculations_Pay_Details: any;
  Calculations_Pension_Details: any;
  Calculations_Commutation_Details: any;
  Calculations_ARD_Details: any;
  //#endregion CALCULATION VARIABLES
  isMaker1: boolean = false
  //#region DOCUMENT UPLOAD VARIABLES
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  files: any[] = [];
  RetirementOrderfiles: any[] = [];
  Govt_files: any[] = [];
  No_DE_files: any[] = [];
  Bank_files: any[] = [];
  No_DuesFile: any[] = [];
  Single_files: any[] = [];
  Single_files1: any[] = [];
  NSDL_files: any[] = [];
  Accommodation_File: any[] = [];
  Joint_files: any[] = [];
  dateofJoinging: any;
  docList: any[] = [];
  url: any;
  id1: any;
  id: any;
  File_name: any;
  doc_list: any[] = [];
  doc_list1: any[] = [];
  show: boolean = false
  Retirementshow: boolean = true;
  Govt_show: boolean = true;
  No_DE_show: boolean = true;
  Bank_show: boolean = true;
  NODue_show: boolean = true;
  Single_show: boolean = true;
  NSDL_show: boolean = true;
  Joint_show: boolean = true;
  Accommodation_show: boolean = true;
  show_doc: any;
  idList: any;
  newDocList: any[] = [];
  //#endregion DOCUMENT UPLOAD VARIABLES
  maxDate2: any;
  currentItem = 'Television';
  message: string = "Are you sure?"
  hide = true;
  deTypeStatus:any;
  isDisabled: boolean = true;
  userDetails: any = {
    "role": "",
    "roleid": "",
    "assignmentid": "",
    "officeid": "",
    "treasCode": "",
    "treasName": ""
  };
  //#region STEPPER
  advancedLoan: any[] = [];
  conditionForm !: FormGroup;
  commutationDetails!: FormGroup;
  registrationForm !: FormGroup;
  jointImageUrl: any = "assets/images/jointImg.jfif";
  imageUrl: any = "assets/images/userImg.png";
  signimageUrl: any = "assets/images/signature.png";
  editFile: boolean = true;
  removeUpload: boolean = false;
  @ViewChild('fileInput') el!: ElementRef;
  Personaldetail2: any;
  serCatId: any;
  Personaldetail: any;
  BankdetailsByIfsc:any;
  getbankaccountdetls: any;
  ServiceDetails: any = {};
  residenceAddress: any;
  interests: City[] = [];
  Request_Confirmation !: FormGroup;
  formGroup !: FormGroup;
  Summary !: FormGroup;
  status: string = 'Deactive';
  drmaster: boolean = false;
  BudgetDetails: any[] = [];
  dateOfBirth: any;
  residenceArray: any[] = [];
  officeArray: any[] = [];
  DepartmentAddress: any[] = [];
  serviceRecordarry: any[] = [];
  serviceRecord_arry: any[] = [];
  serviceRecord_arry_List: any[] = [];
  serviceRecordarry1: any[] = [];
  serviceRecordupdate: any[] = [];
  record: string = '';
  record1: any;

  error: string = '';
  showerror: boolean = false;
  schemeIdForCommutation = 5;
  schemeIdForGratuity = 6;
  schemeIdForArrears = 7;
  empinfo: any;
  makerToken: any;  
  transId: any;
  taskRoleId: any;
  employeeCode: any;
  employeeId: any;
  action: any;
  adApproveFlag: any;
  tasklist: any;
  Remark_Details: any;
  EDIT: any;
  FORWARD: any;
  REVERT: any;
  serviceRecordData: any;
  rid: any;
  Condition: boolean = true;
  treasury: any;
  treasuryName: any;
  datalist: any;
  serviceCatData: any[] = [];
  serviceCatData1: any[] = [];
  addEditServiceRecordslist: any[] = [];
  serviceSubCatData: any[] = [];
  dateofRetirement: any;
  gapArray: gap[] = [];
  isShowNomineeDetails = false;
  gapData: any = [];
  date_Data: count[] = [];
  PersonalDetail_Document: document[] = [];
  document_list: any[] = [];
  RangeChange1: any;
  RangeChange: any;
  reqId: any;
  aid: any;
  confirm: boolean = false;
  isDeStatus: boolean = false;
  isPenalty: boolean = false;

  isMaker: boolean = false;
  isCheckerOrApprover = false;
  makerId: any;
  btnlabel: string = 'Proceed';
  is_doc_show: boolean = false;
  wfProcessId: any;
  assignmentId: any;
  esignData: any;
  frEsignData: any;
  pkEsignData: any;
  psnType: any;
  psnTypeCode: any;
  config: AppConfig = new AppConfig();
  serviceRecordDatanew: any
  mainUrl: any; 
  serviceDtls:any;
  profileDetails:any;
  dmsDocId:any;
  getNomineeDetls:any;
  

  constructor(
    private formbuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private ActivatedRoute: ActivatedRoute,
    private routers: Router, private http: HttpClient,
    private redirectService: RedirectService,
    public actRoute: ActivatedRoute,
    public load: LoaderService,
    private router:Router,
    public apiService: ApiService,
    public api:ApiService,
    private dashboardService:DashboardService,
    public apiurl: ApiUrlService,
    public commonService:CommonService
  ) {

  }

  
  ngOnInit(): void {
    this.dashboardService.setDashboardNav(false);
    this.dashboardService.setLoggedIn(false);
    this.bankForm = this.formbuilder.group({
      accountType: new FormControl('', Validators.required),
      accountNo:new FormControl('', Validators.required),
      ifscCode:new FormControl('', Validators.required),
      bankName:new FormControl('', Validators.required),
      bankBranchName:new FormControl('', Validators.required),
      documentType:new FormControl('', Validators.required), 
      pensionerId:new FormControl('', Validators.required), 

    });
    this.getServiceDetails();
    this.getProfileDetails();
    
  }

  getServiceDetails(){
   var url = this.apiurl.url.getservicerecord;
   let details = localStorage.getItem('profileDetails');
   let decDetails = this.config.decrypt(details);
   this.profileDetails =  JSON.parse(decDetails);
   var data = {
  
    "ssoId": this.profileDetails[0].ssoId,
    "pensionerId": this.profileDetails[0].pensionerId,
     //"ppoNo":this.profileDetails.ppoNo
    // "ssoId": 'PSS.TEST',
     //"pensionerId":"8102841"
   };
   this.api.postpension(url, data).subscribe((res: any) => {
   
     this.serviceDtls=res.data
     console.log("service details >>>",  this.serviceDtls);
    //  this.payCalDetails=res.data[0];    
    //    console.log(this.payCalDetails)  
    })   
 }


  getProfileDetails(){

     var url = this.apiurl.url.getprofiledetails;
     var data = {
       "ssoId": this.profileDetails[0].ssoId
       //"ssoId": 'PSS.TEST'
     };
     this.api.postpension(url, data).subscribe((res: any) => {
       console.log("result>>>", res);
       this.Personaldetail=res.data[0]; 
       this.showPic(this.Personaldetail.employeePhotoGraph)
       this.jointPic(this.Personaldetail.jointPhotoGraph)
      console.log("Personaldetail==>>",this.Personaldetail);
        this.getbankaccountdetails();  
        this.getfamilydetails();   
        this.getNomination();
      })    
   }

  

   getbankaccountdetails(){    
   var url = this.apiurl.url.getbankaccountdetails;
   var data = {
     "ssoId": this.Personaldetail.ssoId,
     "psnId": this.Personaldetail.pensionerId,      
   };
   this.api.postpension(url, data).subscribe((res: any) => {
     console.log("result>>>", res);
     this.getbankaccountdetls=res.data[0];    
       
       this.bankForm.get('accountType')?.patchValue(this.getbankaccountdetls?.accountType);
       this.bankForm.get('accountNo')?.patchValue(this.getbankaccountdetls?.accountNo);
       this.bankForm.get('ifscCode')?.patchValue(this.getbankaccountdetls?.ifscCode);
       this.bankForm.get('bankName')?.patchValue(this.getbankaccountdetls?.bankName);
       this.bankForm.get('bankBranchName')?.patchValue(this.getbankaccountdetls?.bankBranchName);
       this.bankForm.get('documentType')?.patchValue(this.getbankaccountdetls?.documentType);
       this.bankForm.get('pensionerId')?.patchValue(this.Personaldetail.pensionerId);
       this.bankForm.get('MobileNumber')?.patchValue(this.getbankaccountdetls?.mobNo);

     
    })   
    // console.log("mobile number bata bachaa >>>>>> ",getbankaccountdetls)
 }

 // Get Bank details by ifsc // Start // 12/07/2023// 
 bankdetailsbyifsc(){
   var url = this.apiurl.url.bankdetailsbyifsc;
   console.log("ifscCode==>>",this.bankForm.get('ifscCode')?.value);
   var data = {    
    "ifscCode": this.bankForm.get('ifscCode')?.value    
   };
  //  alert(this.getbankaccountdetls.ifscCode)
  if(data.ifscCode.length>9){
   this.api.postpension(url, data).subscribe((res: any) => {
     console.log("result>>>", res);
     this.BankdetailsByIfsc=res.data[0];  
    //console.log("BankdetailsByIfsc==>>",this.BankdetailsByIfsc);      
    this.bankForm.get('bankName')?.patchValue(this.BankdetailsByIfsc?.bankNameEn);
    this.bankForm.get('bankBranchName')?.patchValue(this.BankdetailsByIfsc?.branchNameEn);
    }) 
  } 
  //this.updatebankdetails();
  
}
// Get Bank details by ifsc // End  // 


// Update Bank Details use bY Ifsc Code // Start // 12/07/2023// 
UpdatePssBankDetails:any;

 // Final Submit Data After validate Otp // Start //
 
 FinalFormSubmit(){
  this.bankVerify=1;
 this.verifyMobileNo();
 }

 FinalverifyMobileFormSubmit(){ 
  if (this.bankForm.valid) {
    console.log("bank Form Data vishnu ===>>>",this.bankForm.value);  
      var url = this.apiurl.url.updatebankdetails;
      var data = {
       "accountNo":this.bankForm.controls['accountNo'].value,
       "pensionerId":this.bankForm.controls['pensionerId'].value,
       "ifscCode":this.bankForm.controls['ifscCode'].value
      }; 
      console.log("JSON for bank update",data)
      this.api.postpension(url, data).subscribe((res: any) => {
        console.log("result>>>", res);
        if(res.data){
          alert(res.data);
        }
       })
    this.bankForm.disable();
   } 
   return false;
 }  
 // Final Submit Data After validate Otp // End  // 
// Update Bank Details use bY Ifsc Code // End  // 

// family details //  Add//Start//
FamilydetailsView:any;

getfamilydetails(){  
   var url = this.apiurl.url.getfamilydetails;
   var data = {
    "ssoId":  this.Personaldetail.ssoId,
    "psnId": this.Personaldetail.pensionerId,   
   };
   this.api.postpension(url, data).subscribe((res: any) => {
     console.log("result>>>", res);
     this.FamilydetailsView=res.data; 
 
    console.log("Personaldetail==>>",this.FamilydetailsView);
      // this.getbankaccountdetails();     
    })    
 } 
// family details Add//End //

  wrongType:boolean=false;
  nonQualifyingService: any;
  QualifyingService: any;
  calQualifying: any[] = [];
  calNonQualifying: any[] = [];
  isMilitry: any = 0;
  //#region STEPPER
  step = 0;
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {

    this.step++;
  }

  prevStep() {

    this.step--;


  }

  // ****************************************************************

  stepFamily = 0;
  setStepFamily(index: number) {
    this.stepFamily = index;
  }
  nextStepFamily() {
    this.stepFamily++;
  }
  prevStepFamily() {
    this.stepFamily--;
  }

  // ****************************************************************

  stepc = 0;
  setStepc(index: number) {
    this.stepc = index;
  }
  nextStepc(i: any) {
   
    this.stepc++;
  }
  prevStepc() {
    this.stepc--;


  }

  //#endregion STEPPER

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  //#region PROFILE

  // ****************************PERSONAL DETAIL****************************************
  // uploadFile(event: any) {

  //   let reader = new FileReader(); // HTML5 FileReader API
  //   let file = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {
  //     reader.readAsDataURL(file);

  //     // When file uploads set it to file formcontrol
  //     reader.onload = () => {
  //       this.imageUrl = reader.result;

  //       this.editFile = false;
  //       this.removeUpload = true;
  //     }
  //     // ChangeDetectorRef since file is loading outside the zone
  //     this.cd.markForCheck();
  //   }
  // }
  enhanceDate: any
  fetchPersonaldetail() {

    let data = {
      employeeId: this.employeeId
    }
    console.log("Personal details", this.Personaldetail);
  }


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

  //#endregion PROFILE
  DOAPP: any
  DOJRS: any
  DOPD: any
  DOJPD: any
  DOJ: any
  setDate() {

    

    let data: any[] = this.ServiceDetails.dateTypes
    console.log("data", data)
    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOJRS') {
        this.DOJRS = data[i].dateFormatted
      }
    }
    console.log("date", this.DOJRS);
    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOPD') {
        this.DOPD = data[i].dateFormatted
      }
    }
    console.log("date", this.DOPD);
    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOJPD') {
        this.DOJPD = data[i].dateFormatted
      }
    }
    console.log("date", this.DOJPD);
    for (let i = 0; i < data.length; i++) {
      if (data[i].acronym == 'DOJ') {
        this.DOJ = data[i].dateFormatted
      }
    }
    console.log("date", this.DOJ);
  

  }
 
  //#region FAMILY DETAILS AND NOMINATION

  // getFamilyDetails() {
  //   let data = {
  //     "employeeId": this.employeeId
  //   }
  // }

 
  getPension_Commutation() {

    let data = {
      "employeeCode": this.employeeCode,
      "withheldAmount": 0,
      "deductionAmount": 0,
      "recoveryAmount": 0,
      "allowanceAmount": 0,
      "qualifyingService": this.serviceRecord_arry[0]?.qualifyingService_p === undefined ? null : this.serviceRecord_arry[0]?.qualifyingService_p,
      "nonQualifyingService": this.serviceRecord_arry[0]?.nonQualifyingServiceDate_p === undefined ? null : this.serviceRecord_arry[0]?.nonQualifyingServiceDate_p
    }
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

  commutationDateCalculation(date: any) {
    //alert(this.file);
   // let date1 = this.date.transform(date, 'dd-MMM-yyyy')
    let formData = this.registrationForm.value
    console.log("formData", formData.addDynamicElement)
    let totalRecovery: any = 0;
    for (let t of formData.addDynamicElement) {
      totalRecovery = totalRecovery + t.recoveryAmount
    }
    let totalAllowance: any = 0;
    for (let t of formData.addAllowanceType) {
      totalAllowance = totalAllowance + t.allowanceAmount
    }
    let totalDeduction: any = 0;
    for (let t of formData.addDeduction) {
      totalDeduction = totalDeduction + t.deductionAmount
    }
    let totalwithheld: any = formData.addWithHeld[0].withHeldAmount;
    let data = {
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": 1,
      "withheldAmount": totalwithheld,
      "deductionAmount": [{
        "dedAmount": totalDeduction
      }],
      "recoveryAmount": [{
        "recAmount": totalRecovery
      }],
      "allowanceAmount": totalAllowance,
      "dateOfVCD": "",
      //"cpoEfDate": date1,
      "isPaperLess": 0,
      "cpoValue": this.ServiceDetails.commuationPercentage.toString(),
      "deFlag": this.serviceRecordDatanew.deStatus != "" ? this.serviceRecordDatanew.deStatus : "0",
      "deType": this.serviceRecordDatanew.deStatus != ""?this.serviceRecordDatanew.deType.toString():"",
      "qualifyingService": this.calQualifying,
      "nonQualifyingService": this.calNonQualifying,
      "isPayCommission": this.Calculations_Pay_Details?.payCommissionNameEn?this.Calculations_Pay_Details.payCommissionNameEn:'',
      "isMilitary": this.isMilitry,

    }

    console.log("date", this.Pension_Commutation);
    console.log("data", data);
    var ser_data: any[] = [];

  }
  caculationPension() {
    if (this.isCommutation) {
      let dates = new Date(this.dateofRetirement)
      dates.setDate(dates.getDate() + 1);
      this.commutationDateCalculation(dates);
    }
    else {
      let dates = ""
      this.commutationDateCalculation(dates);
    }
  }
  pensionDetails: any;
  commutationDateCalculation2() {

    let data = {
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": 1,
      "withheldAmount": 0,
      "deductionAmount": [
      ],
      "recoveryAmount": [
      ],
      "allowanceAmount": 0,
      "dateOfVCD": "",
      "cpoEfDate": "",
      "isPaperLess": 0,
      "deFlag": 0,
      "deType": "",
      "qualifyingService": [
      ],
      "nonQualifyingService": [
      ]
    }
    console.log("data", data);
    var ser_data: any[] = [];
  
  }

  value() {
    console.log("Commutation value is here>>>",this.ServiceDetails.optForCommutation )
    if (this.ServiceDetails.optForCommutation == 'Yes') {
      this.isCommutation = true;
      let dates = new Date(this.dateofRetirement)
      console.log("dates", dates);

      dates.setDate(dates.getDate() + 1);
      console.log("dates", dates);
      this.commutationDetails.patchValue({ effectiveDate: dates });
      if (this.ServiceDetails.serviceCatId === 1) {
        this.ServiceDetails.commuationPercentage = 40;
      } else if (this.ServiceDetails.serviceCatId === 13 || this.ServiceDetails.serviceCatId === 7) {
        this.ServiceDetails.commuationPercentage = 50;
      } else {
        this.ServiceDetails.commuationPercentage = 33.33;

      }

      this.commutationDateCalculation(dates);
     
    } else if (this.ServiceDetails.optForCommutation == 'No') {
      this.isCommutation = false;
      this.ServiceDetails.commuationPercentage = "0";
      let dates = "";
      this.commutationDateCalculation(dates);
    }

  }
  pension_calculation(data1: any) {

    console.log("date", this.Pension_Commutation);
    let data = {
      "employeeCode": this.Personaldetail.employeeCode,
      "pensionTypeId": 1,
      "withheldAmount": 0,
      "deductionAmount": [],
      "recoveryAmount": [
      ],
      "allowanceAmount": 0,
      "dateOfVCD": "",
      "cpoEfDate": "",
      "isPaperLess": 0,
      "deFlag": data1.deStatus ? data1.deStatus : 0,
      "deType": data1.deType ? data1.deType : "",
      "qualifyingService": [
      ],
      "nonQualifyingService": [

      ]
    }
    console.log("data", data);
    var ser_data: any[] = [];
    


  }
  ViewCertificate() {

  }
  familyDetails: any;
  nominee: any;

  condition1Amount: any = 0;

  fetchpersonalEmp() {
    let data = {
      "employeeId": this.employeeId
    }
   
  }

  open(item: any) {
    console.log(item)
    if (this.userDetails.roleid != '1' && this.Summary.value.is_agree == true ) {

      this.modalService.open(item);
      // this.get_Task_Detail();
      //this.Remark();
    } else if (this.userDetails.roleid == '1') {
      this.modalService.open(item);
      // this.get_Task_Detail();
      //this.Remark();
    } else {
      if(this.userDetails.roleid !== '1')
      {
        alert("Please confirm that all details viewed are correct.")
      }

    }
  }

  finalSubmit(item: any, stepper: MatStepper){
    if(this.file == undefined && this.userDetails.roleid == '2' ){
      alert('Please Upload Accounts Personnel Certificate');
      stepper.previous();
    }else{
      if (this.userDetails.roleid != '1' && this.Summary.value.is_agree == true) {

        this.modalService.open(item);
        // this.get_Task_Detail();
        //this.Remark();
      } else if (this.userDetails.roleid == '1') {
        this.modalService.open(item);
        // this.get_Task_Detail();
        //this.Remark();
      } else {
        alert("Please confirm that all details viewed are correct.")
      }
    }
  }

  close(i: number) {

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


//21-07-2023// 
  viewDetails(i:number){
    this.dialog.open(CommonDialogueBoxComponent,          
      {data: {
        res: this.FamilydetailsView,
      //res:row,
        index:i,
        Actiontype:"FamilyDetails",
        getEventStatus: (event: any,)=>{console.log(event)
          // this.buttonEvent = event;                        
        }
      },          
    });
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



  get_Task_Detail() {
    let data = {
      "taskId": this.transId
    }    
  }
  selectRemark(remark_id: any) {
    this.Request_Confirmation.patchValue({
      Remarks: remark_id.remarks
    })

  }


  ppo_number: any;
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
  progressFiles: progress[] = [];
  fil: any;

  onStepChange(stepper: MatStepper) {
    this.fil = stepper.selectedIndex
     this.progressFiles.push({
      ind: this.fil
    })

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
  moveToSelectedTab(tabName: string) {
    if (this.userDetails.roleid == '1') {
      if (
        tabName == "Address Details"
      ) {
        if (this.ServiceDetails.optForCommutation == 'Yes') {
          if (this.ServiceDetails.commuationPercentage == 0) {
            alert("Enter Commuation Percentage");
          } else {
            this.moveNext(tabName);
          }
        } else {
          this.moveNext(tabName);
        }

      } else if (tabName == "Pension Details") {
        if (this.ServiceDetails.optForCommutation == 'Yes' && !this.commutationDetails.value.effectiveDate) {
          alert("Enter Commuation Effective Date");
        } else {
          this.moveNext(tabName);
        }
      }
      else {
        this.moveNext(tabName);
      }
    } else {
      this.moveNext(tabName);
    }

  }
  moveNext(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  get addDynamicElement() {
    return this.registrationForm?.get('addDynamicElement') as FormArray
  }
  addItems = () => {
    this.addDynamicElement.push(
      this.formbuilder.group({
        recoveryType: new FormControl(''),
        
        recoveryAmount: new FormControl(''),
        recoveryHead: new FormControl('')
      })
    );
  }
  onChnage()
  {    
  }
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
   uploadFile(event: any) {

    let time1 = new Date();
    this.file = event.target.files[0];
    let ex2:any[]=this.file.name.split("."); 
    //console.log("size",this.file.size/1024)
    if(ex2[1].includes('JPEG') || ex2[1].includes('jpeg') || ex2[1].includes('JPG') || ex2[1].includes('jpg')  || ex2[1].includes('PNG') || ex2[1].includes('png') )
    {
      
    } else
    {
      alert("Only JPEG/PNG/JPG file format allowed")
      return;
    } 

    if((this.file.size/1024)>2048)
    {
      alert("Max 2 MB file size allowed")
      return;
    }
    this.fileName = "doc" + time1.getHours() + time1.getMilliseconds().toString()+"."+ex2[1];
    this.fileName = this.fileName.replace(" ", "")   
    const docTypeId = "32"
    const reader = new FileReader();
    var data4: any;

    reader.onloadend = () => {

      data4 = reader.result;  
      let data5 = data4.toString();
      this.jointImageUrl=data5;
      let str:any
      if(ex2[1].includes('JPEG') || ex2[1].includes('jpeg') || ex2[1].includes('JPG') || ex2[1].includes('jpg')  )
      {
        
        str="data:image/jpeg;base64,"
        
      }else if( ex2[1].includes('PNG') || ex2[1].includes('png'))
      {
        str="data:image/"+ex2[1]+";base64,"
      }else
      {
        str="data:application/"+ex2[1]+";base64,"
      }
   
      data5 = data5.replace(str, "")
     console.log("base 64 code ???",data5)
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docAttributes": [
        ],
        "data": [
          {
            "docTypeId": docTypeId,
            "docTypeName": "jpeg",
            "docName": this.fileName,
            "docTitle": "Joint Photograph",
            "content": data5
          }
        ]
      }   
      console.log(this.jointImageUrl)
      this.apiService.postIntegration("wcc/uploaddocs", data).subscribe((res: any) => {
        console.log(res.data.document[0].docId)
        alert(res.data.document[0].docId) 
        if (res.data.document[0].docId)
         {       
          this.dmsDocId=res.data.document[0].docId;

         }
      })
    };
    reader.readAsDataURL(this.file);  
  }

  updateJointPhoto(){
    this.bankVerify=2;
    this.verifyMobileNo();
  }

 

  updateverifyJointPhoto(){
    let uploadData={
    "empCode":this.Personaldetail.employeeCode,
    "psnId": parseInt(this.Personaldetail.pensionerId),
     "docitem": [
          {
            "docTypeId": 32,
            "createUid": this.Personaldetail.pensionerId,
            "createAid":this.Personaldetail.pensionerId,
              "dmsdocid":this.dmsDocId,
          }
     ]
   }

   console.log(uploadData)  
   this.apiService.requestApplication2(uploadData,'updatephotoid').subscribe((res: any) => {   
    if(res.status ='SUCCESS' && res.data.status=="Success"){
      if((res.data.msg=='Data Save Successfully')==true)
      {
        console.log("after uploade document id",res)
        alert("data updated successfully")
        let data1 =res;               
      }  
    }
    });  
  
  }
  Allowance: any;
  deduction: any;
  WithHeldReasons: any;


  verifyMobileNo(){
    console.log(this.getbankaccountdetls.mobNo)
    if(this.getbankaccountdetls.mobNo)
    {
    let data={
      "ssoId":"RJ121212",
      "sourceId":"1",
      "processId":"18",
      "mobileNo":this.getbankaccountdetls.mobNo,
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
        mobileNo:this.getbankaccountdetls.mobNo
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
          this.updateverifyJointPhoto();
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

  getNomination() {
    console.log(this.Personaldetail.employeeId)
    let data = {
      //"employeeId": this.Personaldetail.employeeId
      //"employeeId":1137240
      "pensionerId": "6589598"
    }
    this.apiService.postpension('nomineeschemedtls',data).subscribe({
     
      next: (response) => {
       
     this.dataSource = new MatTableDataSource(response.data);
        console.log("Nominee deatils",response)
           if (response.status = 'SUCCESS') {
              this.nominee = response.data;
              this.nominee = JSON.parse(JSON.stringify(this.nominee).replace(/\:null/gi, "\:\"\""));
              console.log(this.nominee)
              let product: any;
              let arr=[]
              let arr1=[]
              let arr2=[]
          for (product of this.nominee) {

            if (product.nomineeSchemeName == 'Commutation') {
              arr.push(product);
              this.iconCA = 'person_pin_circle'
              this.commutation_Arr = new MatTableDataSource(arr)

            } else if (product.nomineeSchemeName == 'Arrears') {
              arr1.push(product);
             // this.arrear_Arr = new MatTableDataSource(arr1)

            } else if (product.nomineeSchemeName == 'Gratuity') {

              arr2.push(product);
              //this.gratuity_Arr = new MatTableDataSource(arr2)

            }
          }
         
          this.commutation_Arr = new MatTableDataSource(arr)
          this.arrear_Arr = new MatTableDataSource(arr1)
          this.gratuity_Arr = new MatTableDataSource(arr2)
          
        }
      },
      // error: (err) => {
      //   let errorObj = {
      //     message: err.message,
      //     err: err,
      //     response: err
      //   }
      // }

    });
 }

  // onCellBlur(element: any) {
  //   element.isEditing = false;
  //   //console.log("Edited data ",element)
  // }

}


