
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RedirectService } from 'src/app/services/redirect.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject, retry } from 'rxjs';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';
import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
import { log } from 'console';


@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss']
})
export class AddressDetailsComponent implements OnInit {
 

  @Input() config: any = {};
  @Output() EmpData = new EventEmitter();
  @Input() skipData: Subject<boolean>;
  @Input() userAction: Array<any> = [];
  @Input() addressData: Subject<boolean>;
  @Input() isOtpVerified:boolean;
  roleid:any;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  permanentdistrictList: Array<any> = [];
  stateList: Array<any> = [];
  permanentBlockList: Array<any> = [];
  panchayatWarList: Array<any> = [];
  muncipalList: Array<any> = [];
  essEmployeeAddressSavedata: any;
  rid: any;
  saveAddress: any;
  selectedRecord: any;
  State: any;
  district: any;
  blockId: any;
  getBlockdata: any;
  submitted !: boolean;
  Warddata: any;
  flag: any;
  wardlist: Array<any> = [];
  MuncipalID: any;
  block_panchayat: boolean = true;
  Municipal_ward: boolean = false;
  checked: boolean = false;
  sameAsClick: boolean = true;
  permanentVillageList: Array<any> = [];
  permanentDistrictList: Array<any> = [];
  permanentPanchayatList: Array<any> = [];
  currentVillageList: Array<any> = [];
  currentPanchayatList: Array<any> = [];
  currentStateList: Array<any> = [];
  currentDistrictList: Array<any> = [];
  currentBlockList: Array<any> = [];
  EmployeeAddressDetails: any = { currentAddress: {}, permanentAddress: {} };

  action = '';
  assemblyList: Array<any> = [];
  isSaveEnable = false;
  bankVerify:number=0;
  pensionerDtls:any;
  @Input() address: Subject<boolean>;
    constructor(
    private formbuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private ActivatedRoute: ActivatedRoute,
    private routers: Router, private http: HttpClient,
    private redirectService: RedirectService,
    public actRoute: ActivatedRoute,
    public load: LoaderService,    
    public apiService1: ApiService,
    public apiService:ApiEssService,
    public api:ApiService,
    private dashboardService:DashboardService,
    public apiurl: ApiUrlService,
    public common:CommonService,
    private snackbar: SnackbarService,
  )  { }

  ngOnInit(): void {
    this.pensionerDtls= this.api.getPensionerDtls;
    this.getState();
    this.roleid=sessionStorage.getItem("roleId")
    this.getaddressdetails();
    this.dashboardService.setDashboardNav(false);
    this.dashboardService.setLoggedIn(false);
   

    this.saveAddress = this.formbuilder.group({
      permanentState: new FormControl('', Validators.required),
      permanentDistrict: new FormControl('', Validators.required),
      permanentArea: new FormControl(2),
      permanentMunicipal: new FormControl(''),
      permanentBlock: new FormControl(''),
      permanentWard: new FormControl(''),
      permanentPanchayat: new FormControl(''),
      permanentAssembly: new FormControl(''),
      permanentPincode: new FormControl('', Validators.required),
      permanentHouseNo: new FormControl('', Validators.required),
      permanentVillage: new FormControl(''),
      addressType: [false],
      currentState: [''],
      currentDistrict: [''],
      currentBlock: [''],
      currentPanchayat: [''],
      currentMunicipal: new FormControl(''),
      currentWard: new FormControl(''),
      currentVillage: [''],
      currentPincode: [''],
      currentHouseNo: [''],
      currentAssembly: [''],
      currentArea: [''],
    })

   
    this.addressData.subscribe(v => {
      this.onSubmit();
    });
 
   
  }

  ngOnChanges(changes: any) {
    
    if (!changes.EmpAddress?.firstChange) {
      {
        
        const address = changes.EmpAddress?.currentValue;
        console.log(address)
        this.saveAddress.patchValue({ ...address });
        //  this.saveAddress.patchValue({permanentPanchayat: address?.permanentAddress?.permanentPanchayat });
       
        const data = changes.EmpAddress?.currentValue;
        this.getCdistrict();
        this.getCblock()
        this.getDistrict();
        this.onBlockChange();
        this.getPanchayatWard2()
        this.getPanchayatWard3();
        this.getPanchayatWard4()
        this.onAreaItemChange();
        this.onDistrictChange();
        this.getCblock();
        this.assembly();
        this.getPanchayatWard();
        this.getPanchayatWardcurrent();
        this.onAreaItemChangeCurrent();
      }
    }
    this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    if(this.isOtpVerified)
    {
    
      this.isSaveEnable = true
    
    }
    if(this.roleid=='4' || this.roleid=='5')
    {
      this.isSaveEnable = false
    }

  }

getaddressdetls: any ;
getaddressdetails(){ 

  var url = this.apiurl.url.getaddressdetails;
  console.log("result>>>", this.pensionerDtls);
  var data = {   
    "pensionerId": this.pensionerDtls[0].pensionerId,      
  };
  
  this.api.postpension(url, data).subscribe((res: any) => {
    console.log("result>>>", res);
    
    this. getaddressdetls=res.data;
    this.getaddressdetls.forEach((x:any)=>{
      if(JSON.stringify(x).includes('currentAddressType'))
      {
        this.saveAddress.patchValue({
          currentState:parseInt(x.currentStateId),
          currentDistrict:parseInt(x.currentDistrictId),
          currentBlock:x.currentMunicipalBlockId,
          currentPanchayat:x.currentWardPanchayatId,
          currentMunicipal:parseInt(x.currentMunicipalId),
          currentWard:x.currentWardPanchayatId,
          currentVillage:x.currentVillageStreetId,
          currentPincode:x.currentPinCode,
          currentHouseNo:x.currentAddress,
          currentAssembly:parseInt(x.currentAssemblyId),
          currentArea:x.currentRuralUrban,
        })
      }
      if(JSON.stringify(x).includes('permanentAddressType'))
        {
          this.saveAddress.patchValue({
          permanentState:parseInt(x.permanentStateId),
          permanentDistrict:parseInt(x.permanentDistrictId),
          permanentArea:x.permanentRuralUrban,
          permanentMunicipal:parseInt(x.permanentMunicipalId),
          permanentBlock:x.permanentMunicipalBlockId,
          permanentWard:x.permanentWardPanchayatId,
          permanentPanchayat:x.permanentPanchayatId,
          permanentAssembly:parseInt(x.permanentAssemblyId),
          permanentPincode:x.permanentPinCode,
          permanentHouseNo:x.permanentAddress,
          permanentVillage:x.permanentVillageStreetId,
        })
        }
    })
    console.log("address form",this.saveAddress.value)
      this.getDistrict();
      if (this.saveAddress.value.permanentArea=="RURAL") {
        this.saveAddress.get('permanentArea')?.patchValue(1);
        this.onBlockChange();        
        this.getPanchayatWard2();       
        this.getPanchayatWard3();
      }
      else{
        this.saveAddress.get('permanentArea')?.patchValue(2);
        this.onAreaItemChange();
        this.getPanchayatWard();       
      }     
      this.assembly();
      this.getCdistrict();     
      if ( this.saveAddress.value.currentArea=="RURAL") {
        this.saveAddress.get('currentArea')?.patchValue(1); 
        this.onDistrictChange();
        this.getCblock(); 
        this.getPanchayatWard4();    
      }else{
        this.saveAddress.get('currentArea')?.patchValue(2);
        this.onAreaItemChangeCurrent();
        this.getPanchayatWardcurrent();
      }      
      this.assembly2();
      this.saveAddress.get('pensionerId')?.patchValue(this.pensionerDtls[0].pensionerId);
      this.saveAddress.get('MobileNumber')?.patchValue(this.pensionerDtls[0].mobileNumber); 
   })   
}


  area: string = '';
  state: string = '';

  modify() {
    this.saveAddress.enable();
    this.config.isModified = false;
    this.isSaveEnable = true;
  }

  getState = () => {
    this.apiService.postmdm('getState', {}).subscribe({
      next: (res:any) => {
        if (res.status = 200) {
          this.stateList = res.data
        }
      },

    })
  }
  stateChange(){
    if(this.saveAddress.value.addressType == true){
      this.sameAsClick = true;
      this.saveAddress.controls['currentHouseNo'].enable();
      this.saveAddress.controls['currentPincode'].enable();
      this.saveAddress.patchValue({addressType:false})
    }

    this.saveAddress.patchValue({
      permanentAssembly:"",
      permanentDistrict:"",
      permanentBlock:"",
      permanentPanchayat:"",
      permanentMunicipal:"",                                                                                              
      permanentWard:"",
      permanentVillage:"",
      permanentHouseNo:"",
      permanentPincode:"",                                                                          
     
    })
    this.getDistrict();
  }
  stateChangeCurrent(){
    
    this.saveAddress.patchValue({
      currentAssembly:"",
      currentDistrict:"",
      currentBlock:"",
      currentPanchayat:"",
      currentMunicipal:"",                                                                                              
      currentWard:"",
      currentVillage:"",
      currentHouseNo:"",
      currentPincode:"",                                                                          
     
    })
    this.getCdistrict();
  }
  getDistrict = () => {
    if(this.saveAddress.value.permanentState!=null)
    {
      this.apiService.postmdm('getDistrict', { stateId: this.saveAddress.value.permanentState }).subscribe({
        next: (res:any) => {
          if (res.status = 200) {
            this.permanentdistrictList = res.data
          }
        },
  
      })
    }
   
  }

  getCdistrict() {
    if(this.saveAddress.value.currentState!=null)
    {
      this.state = this.saveAddress.value.currentState;
      this.apiService.postmdm('getDistrict',{ stateId: this.saveAddress.value.currentState } ).subscribe({
        next: (res:any) => {
          if (res.status = 200) {
            this.currentDistrictList = res.data
          }
        },
  
      })
    }
  
  }

  onDistrictChange() {
    if(this.saveAddress.value.currentState!=null &&  this.saveAddress.value.currentDistrict!=null )
    {
      this.apiService.postmdm('getBlock', { stateId: this.saveAddress.value.currentState, distiId: this.saveAddress.value.currentDistrict }).subscribe({
        next: (res:any) => {
          this.currentBlockList = res.data
        }
      })
    }
 
    this.assembly2();
  }
  districtChange()
  {
    if(this.saveAddress.value.addressType == true){
      this.sameAsClick = true;
      this.saveAddress.controls['currentHouseNo'].enable();
      this.saveAddress.controls['currentPincode'].enable();
      this.saveAddress.patchValue({addressType:false})
          }

    this.saveAddress.patchValue({
      permanentAssembly:"",    
      permanentBlock:"",
      permanentPanchayat:"",
      permanentMunicipal:"",                                                                                              
      permanentWard:"",
      permanentVillage:"",
      permanentHouseNo:"",
      permanentPincode:"",                                                                          
     
    })
    this.onBlockChange();
    this.assembly();
  }
  districtChangeCurrent()
  {
    this.saveAddress.patchValue({
      currentAssembly:"",    
      currentBlock:"",
      currentPanchayat:"",
      currentMunicipal:"",                                                                                              
      currentWard:"",
      currentVillage:"",
      currentHouseNo:"",
      currentPincode:"",                                                                          
     
    })
    this.onDistrictChange();
    this.onAreaItemChangeCurrent();
  }
  changeBlock()
  {
    if(this.saveAddress.value.addressType == true){
      this.sameAsClick = true;
      this.saveAddress.controls['currentHouseNo'].enable();
      this.saveAddress.controls['currentPincode'].enable();
      this.saveAddress.patchValue({addressType:false})
          }
    this.saveAddress.patchValue({
    permanentPanchayat:"",
    permanentMunicipal:"",                                                                                              
    permanentWard:"",
    permanentVillage:"",
    permanentHouseNo:"",
    permanentPincode:"",                                                                          
   
  })
    this.getPanchayatWard2()
  }
  changeBlockCurrent()
  {
    this.saveAddress.patchValue({
    currentPanchayat:"",
    currentMunicipal:"",                                                                                              
    currentWard:"",
    currentVillage:"",
    currentHouseNo:"",
    currentPincode:"",                                                                          
   
  })
    this.getCblock()
  }
  changeMuncipal()
  {
    if(this.saveAddress.value.addressType == true){
      this.sameAsClick = true;
      this.saveAddress.controls['currentHouseNo'].enable();
      this.saveAddress.controls['currentPincode'].enable();
      this.saveAddress.patchValue({addressType:false})
          }
    this.saveAddress.patchValue({
                                                                                               
      permanentWard:"",
      permanentVillage:"",
      permanentHouseNo:"",
      permanentPincode:"",                                                                          
     
    })
    this.getPanchayatWard()
  }
  onBlockChange() {
    if(
      this.saveAddress.value.permanentState!=null
      && this.saveAddress.value.permanentDistrict!=null
    )
    {
      this.apiService.postmdm('getBlock', { stateId: this.saveAddress.value.permanentState, distiId: this.saveAddress.value.permanentDistrict }).subscribe({
      
        next: (res:any) => {
          if (res.status = 200) {
            this.permanentBlockList = res.data
          }
        },
      })
    }
  
    this.onAreaItemChange();
    
    
  }
  AsseblyChange(){
    if(this.saveAddress.value.addressType == true){
      this.sameAsClick = true;
      this.saveAddress.controls['currentHouseNo'].enable();
      this.saveAddress.controls['currentPincode'].enable();
      this.saveAddress.patchValue({addressType:false})
          }
  }
  ChangeSameClick(event:any){
    if(this.saveAddress.value.addressType == true){
      this.sameAsClick = true;
      this.saveAddress.controls['currentHouseNo'].enable();
      this.saveAddress.controls['currentPincode'].enable();
      this.saveAddress.patchValue({addressType:false})
          }
  }

  changeValue(event: any) {
console.log(this.saveAddress.value.addressType);
    if (event.checked) {
      this.sameAsClick=false;
      this.saveAddress.controls['currentHouseNo'].disable();
      this.saveAddress.controls['currentPincode'].disable();
      this.saveAddress.patchValue({
        currentState: this.saveAddress.value.permanentState,
        currentDistrict: this.saveAddress.value.permanentDistrict,
        currentArea: this.saveAddress.value.permanentArea,
        currentBlock: this.saveAddress.value.permanentBlock,
        currentPanchayat: this.saveAddress.value.permanentPanchayat,
        currentMunicipal: this.saveAddress.value.permanentMunicipal,
        currentWard: this.saveAddress.value.permanentWard,
        currentVillage: this.saveAddress.value.permanentVillage,
        currentPincode: this.saveAddress.value.permanentPincode,
        currentHouseNo: this.saveAddress.value.permanentHouseNo,
        currentAssembly: this.saveAddress.value.permanentAssembly
      });    
      this.getCdistrict();
      this.onDistrictChange();
      this.getPanchayatWardcurrent();
      this.getCblock();   
      this.getPanchayatWard4();      
      this.assembly2();
      this.onAreaItemChangeCurrent();
    }
    else {
      this.sameAsClick=true;
      this.saveAddress.controls['currentHouseNo'].enable();
      this.saveAddress.controls['currentPincode'].enable();
      this.saveAddress.patchValue({
        currentState: [''],
        currentDistrict: [''],
        currentArea: [''],
        currentBlock: [''],
        currentPanchayat: [''],
        currentMunicipal: [''],
        currentWard: [''],
        currentVillage: [''],
        currentPincode: [''],
        currentHouseNo: [''],
        currentAssembly: [''],
      });
    }

  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  setRequiredFields() {
    if (this.saveAddress.value.permanentArea === 1) {
      this.saveAddress.patchValue({
        permanentMunicipal: null,
        permanentWard: null,
      })
    }
     else {
      this.saveAddress.patchValue({
        permanentBlock: null,
        permanentPanchayat: null,
        permanentVillage: null
      })
    }
  }
  setRequiredFieldscurrent()
  {
    if (this.saveAddress.value.currentArea === 1) {
      this.saveAddress.patchValue({
        currentMunicipal: null,
        currentWard: null,
      })
    } 
    else {
      this.saveAddress.patchValue({
        currentBlock: null,
        currentPanchayat: null,
        currentVillage: null
      })
    }
  }
  onAreaItemChange() {
    if( this.saveAddress.value.permanentDistrict!=null)
    {
      this.apiService.postmdm('getMunicipalArea', { distiId: this.saveAddress.value.permanentDistrict }).subscribe({
        next: (res:any) => {
          if (res.status = 200) {
            this.muncipalList = res.data
            console.log("this.muncipalList", this.muncipalList);
            
          }
        },
      })
  
    }
   
    this.setRequiredFields();
  }
  onRuralUrbanChange()
  {
    if(this.saveAddress.value.addressType == true){
      this.sameAsClick = true;
      this.saveAddress.controls['currentHouseNo'].enable();
      this.saveAddress.controls['currentPincode'].enable();
      this.saveAddress.patchValue({addressType:false})
          }
    if(this.saveAddress.value.permanentArea==1)
    {
      this.onBlockChange();
      this.saveAddress.patchValue({
        permanentMunicipal:"",
        permanentWard:""
      })
      
    }else
    {
      this.onAreaItemChange();
      this.saveAddress.patchValue({
        permanentBlock:"",
        permanentPanchayat:"",
        permanentVillage:""
      })
      
    }
    
  }
  onRuralUrbanChangeCurrent()
  {

    if(this.saveAddress.getRawValue().currentArea==1 )
    {
      this.onDistrictChange();
      this.saveAddress.patchValue({
        currentMunicipal:"",
        currentWard:""
      })
    }else
    {
      this.onAreaItemChangeCurrent();
      this.saveAddress.patchValue({
        currentBlock:"",
        currentPanchayat:"",
        currentVillage:""
      })
    }

  }
  muncipalListcurrent:any
  onAreaItemChangeCurrent() {
   if(this.saveAddress.value.currentDistrict!=null)
   {
    this.apiService.postmdm('getMunicipalArea', { distiId: this.saveAddress.value.currentDistrict }).subscribe({
      next: (res:any) => {
        if (res.status = 200) {
          this.muncipalListcurrent = res.data
        }
      },
    })
   }
    

    this.setRequiredFieldscurrent();
  }
  // onItemChange1() {
  //   if(
  //     this.EmpAddress.value.permanentState!=null &&
  //      this.EmpAddress.value.permanentDistrict!=null
  //   )
  //   {
  //     let data = {
  //       "stateId": this.EmpAddress.value.permanentState,
  //       "distiId": this.EmpAddress.value.permanentDistrict,
  //     }
  //     this.apiService.postmdm('getMunicipalArea', data).subscribe({
  //       next: (res:any) => {
  //         if (res.status = 200) {
  //           this.muncipalList = res.data
  //         }
  //       },
  
  //     })
  //   }
   
  // }

  getCblock() {
    if(
      this.saveAddress.value.currentDistrict!=null &&
       this.saveAddress.value.currentBlock!=null
    )
    {
    const requestedData = {
      "distiId": this.saveAddress.value.currentDistrict,
      "blockId": this.saveAddress.value.currentBlock
    }
    this.apiService.postmdm('getGramPanchayat', { ...requestedData }).subscribe({
      next: (res:any) => {
        if (res.status = 200) {
          this.currentPanchayatList = res.data
        }
      },

    })
  }
  }

  getPanchayatWard2() {
    if(
      this.saveAddress.value.permanentDistrict!=null &&
       this.saveAddress.value.permanentBlock!=null
    )
    {
    const requestedData = {
     
      "distiId": this.saveAddress.value.permanentDistrict,
      "blockId": this.saveAddress.value.permanentBlock
    }
    this.apiService.postmdm('getGramPanchayat', { ...requestedData }).subscribe({
      next: (res:any) => {
        if (res.status = 200) {
          this.permanentPanchayatList = res.data
          console.log("this.permanentPanchayatList",this.permanentPanchayatList)
        }
      },

    })
  }
  }

  getvillage() {
    // if(
    //   this.saveAddress.value.permanentDistrict!=null 
    // )
    if(
      this.saveAddress.value.permanentState!=null &&
      this.saveAddress.value.permanentDistrict!=null &&
      this.saveAddress.value.permanentBlock!=null &&
      this.saveAddress.value.permanentPanchayat!=null
     ){
     let data = {
      stateId: this.saveAddress.value.permanentState,
      distiId: this.saveAddress.value.permanentDistrict,
      blockId: this.saveAddress.value.permanentBlock,
      gramPanchayatId: this.saveAddress.value.permanentPanchayat,
    }
    console.log("this.saveAddress.value.permanentDistrict",this.saveAddress.value.permanentDistrict);
    
    this.apiService.postmdm('getVillage',  data ).subscribe({
      next: (res:any) => {
        this.permanentVillageList = res.data
        console.log("this.permanentVillageList",this.permanentVillageList);
        
      }
    })
  }
  }
  
  getPanchayatWard3() {
    if(
     this.saveAddress.value.permanentState!=null &&
     this.saveAddress.value.permanentDistrict!=null &&
     this.saveAddress.value.permanentBlock!=null &&
     this.saveAddress.value.permanentPanchayat!=null
    )
    {
    let data = {
      stateId: this.saveAddress.value.permanentState,
      distiId: this.saveAddress.value.permanentDistrict,
      blockId: this.saveAddress.value.permanentBlock,
      gramPanchayatId: this.saveAddress.value.permanentPanchayat,
    }
    this.apiService.postmdm('getVillage', data).subscribe({
      next: (res:any) => {
        if (res.status = 200) {
          this.permanentVillageList = res.data
        }
      },

    })
  }
  }
  getPanchayatWard4() {
    if(
      this.saveAddress.value.currentState!=null &&
      this.saveAddress.value.currentDistrict!=null &&
       this.saveAddress.value.currentBlock!=null &&
      this.saveAddress.value.currentPanchayat!=null 
    )
    {

    
    let data = {
      stateId: this.saveAddress.value.currentState,
      distiId: this.saveAddress.value.currentDistrict,
      blockId: this.saveAddress.value.currentBlock,
      gramPanchayatId: this.saveAddress.value.currentPanchayat,
    }
    this.apiService.postmdm('getVillage', data).subscribe({
      next: (res:any) => {
        if (res.status = 200) {
          this.currentVillageList = res.data
        }
      },

    })
  }
  }
  getPanchayatWard() {
    if(
      this.saveAddress.value.permanentMunicipal!=null &&
      this.saveAddress.value.permanentDistrict
    )
    {
      this.apiService.postmdm('getWard', { municipalId: this.saveAddress.value.permanentMunicipal,distiId:this.saveAddress.value.permanentDistrict }).subscribe({
        next: (res:any) => {
          this.wardlist = res.data
        }
      })
    }
   
  }
  wardlistcurrent:any;
  getPanchayatWardcurrent() {
    if(this.saveAddress.value.currentMunicipal!=null &&
      this.saveAddress.value.currentDistrict!=null)
      {
        this.apiService.postmdm('getWard', { municipalId: this.saveAddress.value.currentMunicipal ,distiId:this.saveAddress.value.currentDistrict}).subscribe({
          next: (res:any) => {
            this.wardlistcurrent = res.data
            
          }
        })
      }
   
  }
  assembly = () => {
    if(this.saveAddress.value.permanentDistrict!=null)
    {
      this.apiService.postmdm('getAssembly', { distiId: this.saveAddress.value.permanentDistrict }).subscribe({
        next: (res:any) => {
          this.assemblyList = res.data
        }
      })
    }
  
  }
  assemblyListCurrent:any;
  assembly2 = () => {
    if(this.saveAddress.value.currentDistrict!=null)
    {
      this.apiService.postmdm('getAssembly', { distiId: this.saveAddress.value.currentDistrict }).subscribe({
        next: (res:any) => {
          this.assemblyListCurrent = res.data
        }
      })
    }
   
  }
    onSubmit() {
      debugger
      console.log(this.docId)
      if(Number(this.docId)<1 || this.docId==undefined)
        {
          this.common.openErrorModal("Please upload valid document",'');
          return;
        }


    let permanentRuralUrbanValue="" ;
    let currentRuralUrbanValue="";
    if(!this.saveAddress.value.permanentState 
      ||!this.saveAddress.value.permanentDistrict
      ||!this.saveAddress.value.permanentArea
      ||!this.saveAddress.value.permanentHouseNo
      ||!this.saveAddress.value.permanentPincode
      ||!this.saveAddress.value.permanentAssembly)
      {
        this.common.openErrorModal("Please Select Permanent address all Fields",'');
        return;
      } 
      
    if (this.saveAddress.value.permanentArea==1){
      permanentRuralUrbanValue ="Rural";  
      if(!this.saveAddress.value.permanentBlock ||!this.saveAddress.value.permanentVillage  ||!this.saveAddress.value.permanentPanchayat)
        {
          this.common.openErrorModal("Please Select Permanent Panchayat, Block and Village",'');
          return;
        } 
    }else {
       permanentRuralUrbanValue ="Urban";
       if(!this.saveAddress.value.permanentMunicipal  ||!this.saveAddress.value.permanentWard)
        {
          this.common.openErrorModal("Please Select Permanent Municipal and Ward",'');
          return;
        } 
    }
    if(!this.saveAddress.value.currentState 
      ||!this.saveAddress.value.currentDistrict
      ||!this.saveAddress.value.currentArea
      
     
      ||!this.saveAddress.value.currentHouseNo
      ||!this.saveAddress.value.currentPincode
      ||!this.saveAddress.value.currentAssembly)
      {
        this.common.openErrorModal("Please Select Current address all Fields",'');
        return;
      } 
    if (this.saveAddress.value.currentArea==1){
      currentRuralUrbanValue ="Rural";   
      if(!this.saveAddress.value.currentBlock ||!this.saveAddress.value.currentVillage||!this.saveAddress.value.currentPanchayat)
        {
          this.common.openErrorModal("Please Select Current Panchayat, Block and Village",'');
          return;
        } 
    }else{
      currentRuralUrbanValue ="Urban";
      if(!this.saveAddress.value.currentMunicipal  ||!this.saveAddress.value.currentWard)
        {
          this.common.openErrorModal("Please Select Current Municipal and Ward",'');
          return;
        } 
    }
   
    let permanentStateName= this.stateList.filter((x:any)=>this.saveAddress.value.permanentState==x.stateId)[0]?.stNameEn;
    let permanentDistrictName= this.permanentdistrictList.filter((x:any)=>this.saveAddress.value.permanentDistrict==x.distId)[0]?.distNameEn;
    let permanentMunicipalName= this.muncipalList.filter((x:any)=>this.saveAddress.value.permanentMunicipal==x.munPId)[0]?.munPName;
    let permanentMunicipalBlockName= this.permanentBlockList.filter((x:any)=> this.saveAddress.value.permanentBlock==x.blockId)[0]?.blockNameEn;
    let permanentWardPanchayatName= this.wardlist.filter((x:any)=> this.saveAddress.value.permanentWard==x.wardId)[0]?.wardNameEn;
    let permanentPanchyatName= this.permanentPanchayatList.filter((x:any)=> this.saveAddress.value.permanentPanchayat==x.gramPId)[0]?.gramPNm;
    let permanentAssemblyName= this.assemblyList.filter((x:any)=> this.saveAddress.value.permanentAssembly==x.assemblyId)[0]?.assemblyNameEn;

    let currentStateName= this.stateList.filter((x:any)=>this.saveAddress.value.currentState==x.stateId)[0]?.stNameEn;
    let currentDistrictName= this.currentDistrictList.filter((x:any)=>this.saveAddress.value.currentDistrict==x.distId)[0]?.distNameEn;
    let currentMunicipalName= this.muncipalListcurrent.filter((x:any)=>this.saveAddress.value.currentMunicipal==x.munPId)[0]?.munPName;
    let currentMunicipalBlockName= this.currentBlockList.filter((x:any)=> this.saveAddress.value.currentBlock==x.blockId)[0]?.blockNameEn;
    let currentWardPanchayatName= this.wardlistcurrent.filter((x:any)=> this.saveAddress.value.currentWard==x.wardId)[0]?.wardNameEn;
    let currentPanchyatName= this.currentPanchayatList.filter((x:any)=> this.saveAddress.value.currentPanchayat==x.gramPanchayatId)[0]?.gramPanchayatName;
    let currentAssemblyName= this.assemblyListCurrent.filter((x:any)=> this.saveAddress.value.currentAssembly==x.assemblyId)[0]?.assemblyNameEn;
    const address = {     
      pensionerId: this.pensionerDtls[0].pensionerId,  
      docId:this.docId,   
      permanentAddress: {           
        permanentStateId: this.saveAddress.value.permanentState,
        permanentStateName: permanentStateName,
        permanentDistrictId: this.saveAddress.value.permanentDistrict,       
        permanentDistrictName: permanentDistrictName,
        permanentMunicipalId: this.saveAddress.value.permanentMunicipal,
        permanentMunicipalName: permanentMunicipalName,
        permanentMunicipalBlockId: this.saveAddress.value.permanentBlock,
        permanentMunicipalBlockName: permanentMunicipalBlockName,
        permanentWardPanchayatId: this.saveAddress.value.permanentWard,
        permanentWardPanchayatName: permanentWardPanchayatName,
        permanentPanchyatId: this.saveAddress.value.permanentPanchayat,
        permanentAssemblyId: this.saveAddress.value.permanentAssembly,
        permanentPinCode: this.saveAddress.value.permanentPincode,
        permanentAddress: this.saveAddress.value.permanentHouseNo,
        permanentVillageStreetId: this.saveAddress.value.permanentVillage,
        permanentRuralUrban: permanentRuralUrbanValue,      
        permanentPanchyatName: permanentPanchyatName,
        permanentAssemblyName: permanentAssemblyName
      },
      currentAddress: {
        currentStateId: this.saveAddress.value.currentState,
        currentDistrictId: this.saveAddress.value.currentDistrict,      
        currentMunicipalBlockId: this.saveAddress.value.currentBlock,
        currentPanchyatId: this.saveAddress.value.currentPanchayat,
        currentMunicipalId: this.saveAddress.value.currentMunicipal,
        currentWardPanchayatId: this.saveAddress.value.currentWard,
        currentVillageStreetId: this.saveAddress.getRawValue().currentVillage,
        currentPinCode: this.saveAddress.getRawValue().currentPincode,
        currentAddress: this.saveAddress.getRawValue().currentHouseNo,
        currentAssemblyId: this.saveAddress.value.currentAssembly,
        currentRuralUrban:currentRuralUrbanValue,
        currentStateName: currentStateName,
        currentDistrictName: currentDistrictName,
        currentMunicipalName: currentMunicipalName,
        currentMunicipalBlockName: currentMunicipalBlockName,
        currentWardPanchayatName: currentWardPanchayatName,
        currentPanchyatName: currentPanchyatName,
        currentAssemblyName: currentAssemblyName
      }
      
    } 
    const data = { value: address ,step:1 };
    console.log("address",data);
    this.EmpData.emit(data); 
     
  }
  
  FinalFormSubmit(){
    this.bankVerify=1;
   this.verifyMobileNo();
   }

    verifyMobileNo(){
    //console.log(this.pensionerDtls[0].mobileNumber)
    if(this.pensionerDtls[0].mobileNumber)
    {
    let data={
      "ssoId":"RJ121212",
      "sourceId":"1",
      "processId":"18",
      "mobileNo":this.pensionerDtls[0].mobileNumber,
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
        mobileNo:this.pensionerDtls[0].mobileNumber
      },
    });

    confirmDialog.afterClosed().subscribe(data => {
      console.log("data",data);
      
      if (data.verified === 'Y') {        
        let dataVerified='Y';       
        if(this.bankVerify==1){
          this. onSubmit();
        }
        else if(this.bankVerify==2){         
        } 
        
      }else{       
        alert("The OTP (One-Time Password) was not verified");
      //  let dataVerified='N';
        //return dataVerified;
       
      }
    })
  }
  @Input() docId: any;
  @Output() uploadData = new EventEmitter();
  uploadFile1(event:any)
  {
    console.log("file",event);
    this.uploadData.emit(event); 
  }

  removeDoc()
  {
    this.docId=null;
  }

}
