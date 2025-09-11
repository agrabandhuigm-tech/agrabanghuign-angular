import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiEssService } from 'src/app/services/api-ess.service';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss']
})
export class AddressDetailsComponent implements OnInit {

  @Input() personal: Subject<boolean>;
  @Output() AddressUser = new EventEmitter();
  @Output() EmpData = new EventEmitter();




  addressDetailsForm: FormGroup;
  
  saveAddress: any;
  permanentdistrictList: Array<any> = [];
  stateList: Array<any> = [];
  permanentBlockList: Array<any> = [];
  muncipalList: Array<any> = [];
  assemblyList: Array<any> = [];
  permanentPanchayatList: Array<any> = [];
  permanentVillageList: Array<any> = [];
  wardlist: Array<any> = [];

  currentVillageList: Array<any> = [];
  currentPanchayatList: Array<any> = [];
  currentStateList: Array<any> = [];
  currentDistrictList: Array<any> = [];
  currentBlockList: Array<any> = [];
  EmployeeAddressDetails: any = { currentAddress: {}, permanentAddress: {} };



  area: string = '';
  state: string = '';
  action = '';




  constructor(private fb: FormBuilder,private apiService:ApiEssService,) {

   }

  ngOnInit(): void {

    this.addressDetailsForm = this.fb.group({

      permanentState: new FormControl('', Validators.required),
      permanentDistrict: new FormControl('', Validators.required),
      permanentArea: new FormControl(2),
      permanentBlock: new FormControl(''),
      permanentWard: new FormControl(null),
      permanentPanchayat: new FormControl(''),
      permanentAssembly: new FormControl(''),
      permanentMunicipal: new FormControl(null),
      permanentPincode: new FormControl('', Validators.required),
      permanentHouseNo: new FormControl('', Validators.required),
      permanentVillage: new FormControl(''),



      addressType: [false],
      currentState: [''],
      currentDistrict: [''],
      currentArea: [''],
      currentBlock: [''],
      currentPanchayat: [''],
      currentMunicipal: new FormControl(null),
      currentWard: new FormControl(null),
      currentVillage: [''],
      currentPincode: [''],
      currentHouseNo: [''],
      currentAssembly: [''],
     

     


    });

    this.getState();
    this.getDistrict();
    this.onBlockChange();
    this.assembly();
    this.getPanchayatWard2();
    this.getPanchayatWard3();
    this.getPanchayatWard();
    this.getPanchayatWard4();
    this.getPanchayatWardcurrent();



    this.personal.subscribe(v => { 
      this.onSubmit();
    });

  }



  getState = () => {
    this.apiService.postmdm('getState', {}).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.stateList = res.data
        }
      },

    })
  }


  stateChange(){
    
    this.addressDetailsForm.patchValue({
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

  getDistrict = () => {
    if(this.addressDetailsForm.value.permanentState!=null)
    {
      this.apiService.postmdm('getDistrict', { stateId: this.addressDetailsForm.value.permanentState }).subscribe({
        next: (res) => {
          if (res.status = 200) {
            this.permanentdistrictList = res.data
          }
        },
  
      })
    }
   
  }


  districtChange()
  {
    this.addressDetailsForm.patchValue({
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

  assembly = () => {
    if(this.addressDetailsForm.value.permanentDistrict!=null)
    {
      this.apiService.postmdm('getAssembly', { distiId: this.addressDetailsForm.value.permanentDistrict }).subscribe({
        next: (res) => {
          this.assemblyList = res.data
        }
      })
    }
  
  }






  onBlockChange() {
    if(
      this.addressDetailsForm.value.permanentState!=null
      && this.addressDetailsForm.value.permanentDistrict!=null
    )
    {
      this.apiService.postmdm('getBlock', { stateId: this.addressDetailsForm.value.permanentState, distiId: this.addressDetailsForm.value.permanentDistrict }).subscribe({
        next: (res) => {
          if (res.status = 200) {
            this.permanentBlockList = res.data
          }
        },
      })
    }
  
    this.onAreaItemChange();
    
    
  }

  changeMuncipal()
  {
    this.addressDetailsForm.patchValue({
                                                                                               
      permanentWard:"",
      permanentVillage:"",
      permanentHouseNo:"",
      permanentPincode:"",                                                                          
     
    })
    this.getPanchayatWard()
  }

  getPanchayatWard() {
    if(
      this.addressDetailsForm.value.permanentMunicipal!=null &&
      this.addressDetailsForm.value.permanentDistrict
    )
    {
      this.apiService.postmdm('getWard', { municipalId: this.addressDetailsForm.value.permanentMunicipal,distiId:this.addressDetailsForm.value.permanentDistrict }).subscribe({
        next: (res) => {
          this.wardlist = res.data
        }
      })
    }
   
  }

  setRequiredFields() {
    if (this.addressDetailsForm.value.permanentArea === 1) {
      this.addressDetailsForm.patchValue({
        permanentMunicipal: null,
        permanentWard: null,
      })
      // this.saveAddress.get("permanentMunicipal").clearValidators();
      // this.saveAddress.get('permanentMunicipal').updateValueAndValidity();
      // this.saveAddress.get("permanentWard").clearValidators();
      // this.saveAddress.get('permanentWard').updateValueAndValidity();


      // this.saveAddress.get("permanentBlock").addValidators([Validators.required]);
      // this.saveAddress.get('permanentBlock').updateValueAndValidity();
      // this.saveAddress.get("permanentPanchayat").addValidators([Validators.required]);
      // this.saveAddress.get('permanentPanchayat').updateValueAndValidity();
      // this.saveAddress.get("permanentVillage").addValidators([Validators.required]);
      // this.saveAddress.get('permanentVillage').updateValueAndValidity();
      
     
      // this.saveAddress.get("permanentMunicipal").clearValidators();
      // this.saveAddress.get("permanentWard").clearValidators();
    } else {
      // this.saveAddress.get("permanentBlock").clearValidators();
      // this.saveAddress.get('permanentBlock').updateValueAndValidity();
      // this.saveAddress.get("permanentPanchayat").clearValidators();
      // this.saveAddress.get('permanentPanchayat').updateValueAndValidity();
      // this.saveAddress.get("permanentVillage").clearValidators();
      // this.saveAddress.get('permanentVillage').updateValueAndValidity();

      // this.saveAddress.get("permanentMunicipal").addValidators([Validators.required]);
      // this.saveAddress.get('permanentMunicipal').updateValueAndValidity();
      // this.saveAddress.get("permanentWard").addValidators([Validators.required]);
      // this.saveAddress.get('permanentWard').updateValueAndValidity();
      this.addressDetailsForm.patchValue({
        permanentBlock: null,
        permanentPanchayat: null,
        permanentVillage: null
      })
    }
  }



  onAreaItemChange() {
    if( this.addressDetailsForm.value.permanentDistrict!=null)
    {
      this.apiService.postmdm('getMunicipalArea', { distiId: this.addressDetailsForm.value.permanentDistrict }).subscribe({
        next: (res) => {
          if (res.status = 200) {
            this.muncipalList = res.data
          }
        },
      })
  
    }
   
    this.setRequiredFields();
  }

  onRuralUrbanChange()
  {
    if(this.addressDetailsForm.value==1)
    {
      this.addressDetailsForm.patchValue({
        permanentMunicipal:"",
        permanentWard:""
      })
    }else
    {
      this.addressDetailsForm.patchValue({
        permanentBlock:"",
        permanentPanchayat:"",
        permanentVillage:""
      })
    }

    this.onAreaItemChange();
  }

  changeBlock()
  {
    this.addressDetailsForm.patchValue({
    permanentPanchayat:"",
    permanentMunicipal:"",                                                                                              
    permanentWard:"",
    permanentVillage:"",
    permanentHouseNo:"",
    permanentPincode:"",                                                                          
   
  })
    this.getPanchayatWard2()
  }

  getPanchayatWard2() {
    if(
      this.addressDetailsForm.value.permanentDistrict!=null &&
       this.addressDetailsForm.value.permanentBlock!=null
    )
    {
    const requestedData = {
     
      "distiId": this.addressDetailsForm.value.permanentDistrict,
      "blockId": this.addressDetailsForm.value.permanentBlock
    }
    this.apiService.postmdm('getGramPanchayat', { ...requestedData }).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.permanentPanchayatList = res.data
          console.log("this.permanentPanchayatList",this.permanentPanchayatList)
        }
      },

    })
  }
  }

  getvillage() {
    if(
      this.addressDetailsForm.value.permanentDistrict!=null 
    )
    this.apiService.postmdm('getVillage', { distiId: this.addressDetailsForm.value.permanentDistrict }).subscribe({
      next: (res) => {
        this.permanentVillageList = res.data
      }
    })
  }

  getPanchayatWard3() {
    if(
     this.addressDetailsForm.value.permanentState!=null &&
     this.addressDetailsForm.value.permanentDistrict!=null &&
     this.addressDetailsForm.value.permanentBlock!=null &&
     this.addressDetailsForm.value.permanentPanchayat!=null
    )
    {
    let data = {
      stateId: this.addressDetailsForm.value.permanentState,
      distiId: this.addressDetailsForm.value.permanentDistrict,
      blockId: this.addressDetailsForm.value.permanentBlock,
      gramPanchayatId: this.addressDetailsForm.value.permanentPanchayat,
    }
    this.apiService.postmdm('getVillage', data).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.permanentVillageList = res.data
        }
      },

    })
  }
  }



  changeValue(event: any) {

    if (event.checked) {
      this.addressDetailsForm.patchValue({
        currentState: this.addressDetailsForm.value.permanentState,
        currentDistrict: this.addressDetailsForm.value.permanentDistrict,
        currentArea: this.addressDetailsForm.value.permanentArea,
        currentBlock: this.addressDetailsForm.value.permanentBlock,
        currentPanchayat: this.addressDetailsForm.value.permanentPanchayat,
        currentMunicipal: this.addressDetailsForm.value.permanentMunicipal,
        currentWard: this.addressDetailsForm.value.permanentWard,
        currentVillage: this.addressDetailsForm.value.permanentVillage,
        currentPincode: this.addressDetailsForm.value.permanentPincode,
        currentHouseNo: this.addressDetailsForm.value.permanentHouseNo,
        currentAssembly: this.addressDetailsForm.value.permanentAssembly
      });
      
      this.getCdistrict();
      this.onDistrictChange();
      this.getPanchayatWardcurrent();
      this.getCblock();   
      this.getPanchayatWard4();      
      this.assembly2();
      this.onAreaItemChangeCurrent();
     
    
      
      // this.permanentDistrictList = this.currentDistrictList;
      // this.permanentBlockList = this.currentBlockList;
      // this.permanentPanchayatList = this.currentPanchayatList;
      // this.permanentVillageList = this.currentVillageList;
    }
    else {
      this.addressDetailsForm.patchValue({
        currentState: [''],
        currentDistrict: [''],
        currentArea: this.addressDetailsForm.value.permanentArea,
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

  stateChangeCurrent(){
    
    this.addressDetailsForm.patchValue({
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

  getCdistrict() {
    if(this.addressDetailsForm.value.currentState!=null)
    {
      this.state = this.addressDetailsForm.value.currentState;
      this.apiService.postmdm('getDistrict',{ stateId: this.addressDetailsForm.value.currentState } ).subscribe({
        next: (res) => {
          if (res.status = 200) {
            this.currentDistrictList = res.data
          }
        },
  
      })
    }
  
  }

  districtChangeCurrent()
  {
    this.addressDetailsForm.patchValue({
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

  
  onDistrictChange() {
    if(this.addressDetailsForm.value.currentState!=null &&  this.addressDetailsForm.value.currentDistrict!=null )
    {
      this.apiService.postmdm('getBlock', { stateId: this.addressDetailsForm.value.currentState, distiId: this.addressDetailsForm.value.currentDistrict }).subscribe({
        next: (res) => {
          this.currentBlockList = res.data
        }
      })
    }
 
    this.assembly2();
  }

  muncipalListcurrent:any
  onAreaItemChangeCurrent() {
   if(this.addressDetailsForm.value.currentDistrict!=null)
   {
    this.apiService.postmdm('getMunicipalArea', { distiId: this.addressDetailsForm.value.currentDistrict }).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.muncipalListcurrent = res.data
        }
      },
    })
   }
    

    this.setRequiredFieldscurrent();
  }

  setRequiredFieldscurrent()
  {
    if (this.addressDetailsForm.value.currentArea === 1) {
      this.addressDetailsForm.patchValue({
        currentMunicipal: null,
        currentWard: null,
      })
      // this.saveAddress.get("currentWard").clearValidators();
      // this.saveAddress.get('currentWard').updateValueAndValidity();
      // this.saveAddress.get("currentMunicipal").clearValidators();
      // this.saveAddress.get('currentMunicipal').updateValueAndValidity();

      // this.saveAddress.get("currentBlock").addValidators([Validators.required]);
      // this.saveAddress.get('currentBlock').updateValueAndValidity();
      // this.saveAddress.get("currentPanchayat").addValidators([Validators.required]);
      // this.saveAddress.get('currentPanchayat').updateValueAndValidity();
      // this.saveAddress.get("currentVillage").addValidators([Validators.required]);
      // this.saveAddress.get('currentVillage').updateValueAndValidity();
     
   
    
    } else {
      // this.saveAddress.get("currentBlock").clearValidators();
      // this.saveAddress.get('currentBlock').updateValueAndValidity();
      // this.saveAddress.get("currentPanchayat").clearValidators();
      // this.saveAddress.get('currentPanchayat').updateValueAndValidity();
      // this.saveAddress.get("currentVillage").clearValidators();
      // this.saveAddress.get('currentVillage').updateValueAndValidity();
    
  
      
    
      // this.saveAddress.get("currentMunicipal").addValidators([Validators.required]);
      // this.saveAddress.get('currentMunicipal').updateValueAndValidity();
      // this.saveAddress.get("currentWard").addValidators([Validators.required]);
      // this.saveAddress.get('currentWard').updateValueAndValidity();
      this.addressDetailsForm.patchValue({
        currentBlock: null,
        currentPanchayat: null,
        currentVillage: null
      })
    }
  }

  assemblyListCurrent:any;
  assembly2 = () => {
    if(this.addressDetailsForm.value.currentDistrict!=null)
    {
      this.apiService.postmdm('getAssembly', { distiId: this.addressDetailsForm.value.currentDistrict }).subscribe({
        next: (res) => {
          this.assemblyListCurrent = res.data
        }
      })
    }
   
  }

  onRuralUrbanChangeCurrent()
  {
    if(this.addressDetailsForm.value==1)
    {
      this.addressDetailsForm.patchValue({
        currentMunicipal:"",
        currentWard:""
      })
    }else
    {
      this.addressDetailsForm.patchValue({
        currentBlock:"",
        currentPanchayat:"",
        currentVillage:""
      })
    }

    this.onAreaItemChangeCurrent();
  }

  changeBlockCurrent()
  {
    this.addressDetailsForm.patchValue({
    currentPanchayat:"",
    currentMunicipal:"",                                                                                              
    currentWard:"",
    currentVillage:"",
    currentHouseNo:"",
    currentPincode:"",                                                                          
   
  })
    this.getCblock()
  }

  getCblock() {
    if(
      this.addressDetailsForm.value.currentDistrict!=null &&
       this.addressDetailsForm.value.currentBlock!=null
    )
    {
    const requestedData = {
      "distiId": this.addressDetailsForm.value.currentDistrict,
      "blockId": this.addressDetailsForm.value.currentBlock
    }
    this.apiService.postmdm('getGramPanchayat', { ...requestedData }).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.currentPanchayatList = res.data
        }
      },

    })
  }
  }

  getPanchayatWard4() {
    if(
      this.addressDetailsForm.value.currentState!=null &&
      this.addressDetailsForm.value.currentDistrict!=null &&
       this.addressDetailsForm.value.currentBlock!=null &&
      this.addressDetailsForm.value.currentPanchayat!=null 
    )
    {

    
    let data = {
      stateId: this.addressDetailsForm.value.currentState,
      distiId: this.addressDetailsForm.value.currentDistrict,
      blockId: this.addressDetailsForm.value.currentBlock,
      gramPanchayatId: this.addressDetailsForm.value.currentPanchayat,
    }
    this.apiService.postmdm('getVillage', data).subscribe({
      next: (res) => {
        if (res.status = 200) {
          this.currentVillageList = res.data
        }
      },

    })
  }
  }

  wardlistcurrent:any;
  getPanchayatWardcurrent() {
    if(this.addressDetailsForm.value.currentMunicipal!=null &&
      this.addressDetailsForm.value.currentDistrict!=null)
      {
        this.apiService.postmdm('getWard', { municipalId: this.addressDetailsForm.value.currentMunicipal ,distiId:this.addressDetailsForm.value.currentDistrict}).subscribe({
          next: (res) => {
            this.wardlistcurrent = res.data
            
          }
        })
      }
   
  }

  onSubmit() {
    console.log(this.addressDetailsForm.value)
   
    const address = {
      permanentAddress: {
        permanentState: this.addressDetailsForm.value.permanentState,
        permanentDistrict: this.addressDetailsForm.value.permanentDistrict,
        permanentArea: this.addressDetailsForm.value.permanentArea,
        permanentMunicipal: this.addressDetailsForm.value.permanentMunicipal,
        permanentBlock: this.addressDetailsForm.value.permanentBlock,
        permanentWard: this.addressDetailsForm.value.permanentWard,
        permanentPanchayat: this.addressDetailsForm.value.permanentPanchayat,
        permanentAssembly: this.addressDetailsForm.value.permanentAssembly,
        permanentPincode: this.addressDetailsForm.value.permanentPincode,
        permanentHouseNo: this.addressDetailsForm.value.permanentHouseNo,
        permanentVillage: this.addressDetailsForm.value.permanentVillage,
      },
      currentAddress: {
        currentState: this.addressDetailsForm.value.currentState,
        currentDistrict: this.addressDetailsForm.value.currentDistrict,
        currentArea: this.addressDetailsForm.value.currentArea,
        currentBlock: this.addressDetailsForm.value.currentBlock,
        currentPanchayat: this.addressDetailsForm.value.currentPanchayat,
        currentMunicipal: this.addressDetailsForm.value.currentMunicipal,
        currentWard: this.addressDetailsForm.value.currentWard,
        currentVillage: this.addressDetailsForm.value.currentVillage,
        currentPincode: this.addressDetailsForm.value.currentPincode,
        currentHouseNo: this.addressDetailsForm.value.currentHouseNo,
        currentAssembly: this.addressDetailsForm.value.currentAssembly
      }
    }

    let AdressDetailsFormData = address;
    this.AddressUser.emit(AdressDetailsFormData);


    const data = { step: 1, value: address, action: this.action,validate:true };
    console.log("address",data)
    // this.EmpData.emit(data);

  
  }




  // onSubmit(){
  //   console.log(this.serviceDetailsForm.value)
  
  //   let serviceFormData = this.serviceDetailsForm.value;
  
  //   this.ServiceUser.emit(serviceFormData);
  
  //   const data = { step: 1, value: serviceFormData, action: this.action, validate: true }
  
  //   this.EmpData.emit(data);
  
  
  // }



}
