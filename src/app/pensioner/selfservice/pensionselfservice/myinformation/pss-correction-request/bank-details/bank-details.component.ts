import { FormArray} from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { log } from 'console';
import { RedirectService } from 'src/app/services/redirect.service';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { retry, Subject } from 'rxjs';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { MatDrawer,} from '@angular/material/sidenav';
import { ApiService } from 'src/app/services/api.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material/table';




@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})

export class BankDetailsComponent implements OnInit {
  value:any;
  ifscCode:any;
  type:any='E';
  bankDtls:any;
  psnDtls:any;
  accNo:any;
  conAccNo:any;
  newIfscCode:any;
  inputType: string = 'text';
  userDetails:any;
  config: AppConfig = new AppConfig();
  constructor(public common:CommonService,
    public _Service:ApiService,
    public load:LoaderService,private router:Router) {    this._Service.configMenu = { url: "Update Bank Details",nUrl:"pension/tool/update-ifsc" };
    this.userDetails = this.config.getUserDetails();
    this.user = this._Service.userInfo();
    this.value = this.user?.employeeId;
    this.type = 'E';
    // this.getPensionDBData();
   
  }
user:any;
  @Input() bank: Subject<boolean>;
   @Output() EmpData = new EventEmitter();
   @Input() skipData: Subject<boolean>;
   @Input() isFamilyPensioner:any;
  ngOnInit(): void {
    this.bank.subscribe(v => {
      this.Submit()
     });
  }
  eConfirm:boolean=true;
  toggleInputType() {
 
    if(this.accNo.length<9 || this.accNo.length>18)
    {
      this.common.openErrorModal("The account number length must be between  9 and 18 digits.");
    }else
    {
      if( this.inputType === 'text')
        {
          this.inputType =  'password';
        }
        this.eConfirm=false;
    }
  }
  getPensionDBData(i:any)
  {
    if(!this.value)
      {
          this.common.openErrorModal("Enter Value","",()=>{});
          return;
      }
      
      this.common.getPensionDBData(this.value,this.type,7,(res:any)=>{
        console.log("pension Data1",res);
        if(JSON.stringify(res).includes("no data available"))
          {}else{
            this.psnDtls=res.data[0];
           console.log("pensioner details",this.psnDtls)
           if(i==2)
           {
            this.getFamilyPensionerDetails()
           }
          }
      })
      if(i==1)
      {
        this.common.getPensionDBData(this.value,this.type,25,(res:any)=>{
          console.log("pension Data1",res);
          if(JSON.stringify(res).includes("no data available"))
            {}else{
              this.bankDtls=res.data[0];
              this.ifscCode=this.bankDtls?.ifscCode
            }
        })
      }
     
    
  }
  newBankDtls:any;
  getBankBranchByIfsc(){
   
   if(this.newIfscCode)
   {
    let requestedData = {
      ifscCode: this.newIfscCode
    }
    this.load.show();
    this._Service.postpension('bankdetailsbyifsc',requestedData).subscribe({
      next: res => {
        this.load.hide();
        if(res?.status == 'SUCCESS' && res?.data.length > 0 && !res?.data[0]?.msg){
         console.log("res",res)
         this.newBankDtls=res.data[0];
        }else{       
          this.newBankDtls=null;      
          this.common.openErrorModal('Bank detail not found by IFSC code','',()=>{               
          });
        }
        
      },error: (err: any)=>{   
        this.load.hide();   
        this.newBankDtls=null;   
        this.common.openErrorModal('Bank detail not found by IFSC code','',()=>{               
        });
      }
    })
   }
    
    
    
  }
  Submit()
  {
    if(this.accNo.length<9 || this.accNo.length>18)
      {
        this.common.openErrorModal("The account number length must be between  9 and 18 digits.");
        return;
      }
    if(this.conAccNo != this.accNo)
    {
      this.common.openErrorModal("Account no didn't match.",'');
      return;
    }
    if(!this.newIfscCode)
    {
      this.common.openErrorModal("Please enter ifsc code.",'');
      return;
    }
    
    if(this.newBankDtls.branchId<1)
      {
        this.common.openErrorModal("Bank Branch not valid.",'');
        return;
      }
      if(Number(this.docId)<1  || this.docId==undefined)
        {
          this.common.openErrorModal("Please upload valid document",'');
          return;
        }
    
      let data1={
        'pensionerId':this.psnDtls.pensionerId,
        'bankBranchId':this.newBankDtls.branchId,
        'ifscCode':this.newIfscCode,
        'accNo':this.conAccNo,
        'ipAddress':this.userDetails?.ipAddress,
        'docId':this.docId  ,
        'familyMemId':this.PersonaldetailFamily?.familyMemId?this.PersonaldetailFamily?.familyMemId:0
      }
      console.log("submit data",data1);
      const data = { value: data1 ,step:2 };
      console.log("bank",data);
      this.EmpData.emit(data); 

    
  }
  isUpdate:boolean=false;
  changeIfsc()
  {
    this.isUpdate=true;
  }
  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.key.charCodeAt(0);

    // Allow: Backspace, Delete, Tab, Escape, Enter, Arrow keys
    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'Tab' ||
      event.key === 'Escape' ||
      event.key === 'Enter' ||
      (event.key >= 'ArrowLeft' && event.key <= 'ArrowRight')
    ) {
      return true;
    }

    // Allow: Digits 0-9
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }

    // Block everything else
    event.preventDefault();
    return false;
  }
  @Input() docId: any;
  @Output() uploadData = new EventEmitter();
  uploadFile(event:any)
  {
    console.log("file",event);
    this.uploadData.emit(event); 
  }
  removeDoc()
  {
    this.docId=null;
  }
  family:any;
  PersonaldetailFamily:any;
  ngOnChanges(changes: any) {
    if (changes.hasOwnProperty('isFamilyPensioner') ) {
console.log("isFamilyPensioner",this.isFamilyPensioner)
     if(Number(this.isFamilyPensioner)>1 && this.isFamilyPensioner!=undefined)
     {
      this.getPensionDBData(2);
     
     }else
     {
      this.getPensionDBData(1);
     }
     
     
     }
    }

    getFamilyPensionerDetails()
    {
      this.family="Family Pensioner "
  
      let femData={
        "inType":7,
        "pensionerId":this.psnDtls.pensionerId
      }
            this._Service.postpension("pensionCorrectionProcess",femData).subscribe((res: any) => {
        this.load.hide();
          if(JSON.stringify(res).includes("pensionerId"))
          {
            this.PersonaldetailFamily=res.data[0];
            let femData={
              "inType":8,
              "familyMemId": this.PersonaldetailFamily.familyMemId
            }
                  this._Service.postpension("pensionCorrectionProcess",femData).subscribe((res: any) => {
              this.load.hide();
                if(JSON.stringify(res).includes("familyMemId"))
                {
                  
                  this.bankDtls=res.data[0];
                  this.ifscCode=this.bankDtls?.ifscCode
                }else
                {
                  this.common.openErrorModal("Error in service.","")
                }
            },(error)=>{
              this.load.hide();
              this.common.openErrorModal("Error in service.","")
            })
          
          }else
          {
            this.common.openErrorModal("Error in service.","")
          }
      },(error)=>{
        this.load.hide();
        this.common.openErrorModal("Error in service.","")
      })
    }
}
