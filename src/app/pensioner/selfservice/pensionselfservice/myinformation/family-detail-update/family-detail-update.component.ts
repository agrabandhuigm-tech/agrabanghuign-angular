import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import moment from 'moment';
import { Subject } from 'rxjs';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { debounceTime, of, startWith, switchMap } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ApiService } from 'src/app/services/api.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { AppConfig } from 'src/app/app.config';
import { Console } from 'console';

@Component({
  selector: 'app-family-detail-update',
  templateUrl: './family-detail-update.component.html',
  styleUrls: ['./family-detail-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

// export class FamilyDetailUpdateComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

export class FamilyDetailUpdateComponent implements OnInit {
  @Input() EmpFamily: any;
  @Input() JanUserList: any;
  @Input() config: any = {};
  @Output() EmpData = new EventEmitter();
  @Output() JanaadhaarUser = new EventEmitter();
  @Input() userAction: Array<any> = [];
  @Input() personal: Subject<boolean>;
  config1=new AppConfig();
  familyDetails: any;
  alternateNominee: any;
  today = new Date();
  getRelationList: Array<any> = [];
  getGenderList: Array<any> = [];
  getMaritalStatusList: any;
  frmNominee: any;
  getSchemeTypeList: any;
  getSchemeTypeListnew:any[]=[]
  EmployeeFamilyDetails: any = { familyDetails: [], nomineeDetails: [] }
  EmployeeAlternateyDetails: any = { alternateNominee: [] }
  IsEdit = false;
  index: number = 0;
  janaadhaarList: Array<any> = [];
  datePipe: any;
  date: Date;
  isSaveEnable = false;
  alternateSchemeList: Array<any> = [];
  FamilyRelationAlllist: Array<any> = [];
  pensionerDtls:any;
  familyDetailsData:any;
  action = '';
  files: any[] = [];
  file: any;
  fileName: any;
  dmsDocId:any;
  dmsdocidEmp:any;
  
  jointImageUrl: any = "assets/images/jointImg.jfif";
  imageUrl: any = "assets/images/userImg.png";
  signimageUrl: any = "assets/images/signature.png";
  File_name: any;

  isOffice: boolean =true;
  isOfficeShow:boolean=true;
  pensionInitOffice: any;
  office: any;
  userdetails:any;

  // pensionerId:any;
  constructor(private formbuilder: FormBuilder,private apiService: ApiEssService,public apiService1: ApiService,public api:ApiService,public apiurl: ApiUrlService,     
     private snackbar: SnackbarService, private dashboardService:DashboardService,) {
    this.date = new Date();
  }
  
  ngOnInit(): void {
    this.dashboardService.setDashboardNav(false);
    this.dashboardService.setLoggedIn(false);

    this.pensionerDtls= this.api.getPensionerDtls;

    // this.jointPic(this.pensionerDtls.jointPhotoGraph)
    console.log("Data builed by vishnu >>>>>>>>",this.pensionerDtls)
    // console.log("emp photo id >>>", this.pensionerDtls[0].employeePhotoGraph)
    // console.log("emp photo id >>>", this.pensionerDtls[0].jointPhotoGraph)
    this.jointPic(this.pensionerDtls[0].jointPhotoGraph)
    this.showPic(this.pensionerDtls[0].employeePhotoGraph)
   // pensionerId = this .pensionerDtls.pensionerId;  //"1640954"
   // 

    this.familyDetails = this.formbuilder.group({
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      dob: ['', Validators.required],
      physicallyDisabled: [0, Validators.required],
      percentageOfDisability: new FormControl({ value: '' }),
      dependent: [0, Validators.required],
      employed: [0, Validators.required],
      janAadharId: ['',],
      memberId: [''],
      govEmployee: [0],
      employeeId: [''],
      familyMemId: [0],
      familyActive: ["1"]
    });

 

    this.frmNominee = this.formbuilder.group({
      schemes: ['', Validators.required],
      nameOfNominee: [''],
      relation: ['', Validators.required],
      share: ['', Validators.required],
      familyMemId: ['', Validators.required],
      schemeNomId: [0],
      nomineeActive: [1]
    })


    this.alternateNominee = this.formbuilder.group({
      name: [''],
      memberId: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      dob: ['', Validators.required],
      janAadharId: ['',],
      scheme: ['', Validators.required],
      nameOfNominee: [''],
      relation: ['', Validators.required],
      share: ['', Validators.required],
      Exsit: [true],
    });

    this.getRelation();
    this.getGender();
    this.getMaritalStatus();
    this.getSchemeType();
    this.getAlternateScheme();
    this.getFamilyRelationAll()

    if (this.config.isView) {
      this.familyDetails.disable();
      this.frmNominee.disable();
    }


    this.getfamilydetailsnew();
    this.getnomineeDetailsnew();
    this.userdetails= this.config1.getUserDetails();
    console.log("userdetails",this.userdetails)  
    this.checkOfficeId(3);
    this.getDepartmentList();
 
    
   
  }
  
// Vishnu code // 

//getaddressdetls: any ;
getfamilydetailsnew(){    
  var url = this.apiurl.url.getfamilydetailsnew;
  var data = {   
    "pensionerId": this.pensionerDtls[0].pensionerId,
    "inType":1       
  };
  this.api.postpension(url, data).subscribe((res: any) => {
    console.log("result>>>", res);
//this.familyDetailsData=res.data;
debugger;
this.EmployeeFamilyDetails.familyDetails=res.data;
    console.log("Family details ka data bata londee >>>>", this.EmployeeFamilyDetails.familyDetails,this.familyDetails)    
   })  
}
getnomineeDetailsnew(){  
  var url = this.apiurl.url.getfamilydetailsnew;
  var data = {   
    "pensionerId": this.pensionerDtls[0].pensionerId,
    "inType":2       
  };
  this.api.postpension(url, data).subscribe((res: any) => {
    console.log("resultNominee>>>", res);
     if(res.data[0].msg == "Error-Occurred"){
      this.EmployeeFamilyDetails.nomineeDetails = [];
     }
     else{
   this.EmployeeFamilyDetails.nomineeDetails=res.data;
     }
    console.log("nominee details ka data bata londee >>>>", this.EmployeeFamilyDetails.nomineeDetails)    
   })  
}


// Vishnu Code End // 





  ngOnChanges(changes: any) {
    console.log(changes)
    if (changes.hasOwnProperty('EmpFamily')) {

      this.EmployeeFamilyDetails = changes.EmpFamily.currentValue;

      console.log(this.EmployeeFamilyDetails)
      console.log("family details ", this.EmployeeFamilyDetails)

    }
    this.config.isModified === true ? this.isSaveEnable = true : this.isSaveEnable = false;
    if (changes.hasOwnProperty('JanUserList')) {
      const data = changes.JanUserList.currentValue || [];
      data.forEach((user: any) => {
        this.EmployeeFamilyDetails.familyDetails.push({
          name: user.nameEng,
          memberId: user.jan_mid,
          dob:user.dob!=null?new Date(user.dob):"",
          janAadharId: user.janaadhaarId,
          relationship: 0,
          gender: 0,
          maritalStatus: '',
          physicallyDisabled:user.physicallyDisabled!=null?user.physicallyDisabled:'0',
        
          // disabilityId: false,
          // disabilityPercentage: '',
          dependent: false,
          employed: false
        })

      });
     
    }
  }

  modify() {
    this.familyDetails.enable();
    this.frmNominee.enable();
    this.config.isView = false;
    this.isSaveEnable = true;
  }



  getRelation = () => {
    this.apiService.postmdm('getFamilyRelation', {}).subscribe({
      next: (res:any) => {
        this.getRelationList = res.data;
      }
    })
  }
  getGender = () => {
    this.apiService.postmdm('getGender', {}).subscribe({
      next: (res:any) => {
        this.getGenderList = res.data;
      }
    })
  }
  getMaritalStatus = () => {
    this.apiService.postmdm('getMaritalStatus', {}).subscribe({
      next: (res:any) => {
        this.getMaritalStatusList = res.data;
      }
    })
  }
  getSchemeType = () => {

    this.apiService.postmdm('getSchemeType', {}).subscribe({
      next: (res:any) => {
        let data=res.data;
        this.getSchemeTypeList = res.data;
        let newdocumentlist:any = data.filter((item:any) => item.schNomId == "7")[0];
        this.getSchemeTypeListnew.push(newdocumentlist)
          newdocumentlist = data.filter((item:any) => item.schNomId == "5")[0];
          this.getSchemeTypeListnew.push(newdocumentlist)
           newdocumentlist = data.filter((item:any) => item.schNomId == "6")[0];
            this.getSchemeTypeListnew.push(newdocumentlist);
            console.log("getSchemeTypeListnew",this.getSchemeTypeListnew)
      }
    })

  }

  getFamilyRelationAll = () => {
    this.apiService.postmdm('getFamilyRelationAll', {}).subscribe({
      next: (res:any) => {

        this.FamilyRelationAlllist = res.data;
      }
    })

  }

  // alternate 
  getAlternateScheme = () => {
    this.apiService.postmdm('getAlternateScheme', {}).subscribe({
      next: (res:any) => {

        this.alternateSchemeList = res.data;
      }
    })

  }


  Nomineemember(status: any) {
    this.alternateNominee.patchValue({
      Exsit: status,
    })


  }
  getScheme = (id: number) => {
    if (id !== undefined)
      return this.getSchemeTypeList.filter((x: any) => x.schNomId == id)[0]?.schNomNameEn;     
  }

  saveFamily() {
   
    console.log(this.familyDetails)
    console.log("Family Detaill >>>>>",this.familyDetails);
    if(this.familyDetails.value.janAadharId == null || this.familyDetails.value.janAadharId == ''|| this.familyDetails.value.janAadharId == '0'){
      this.familyDetails.patchValue({memberId:""})
      this.snackbar.show("Please enter janAadharId...","danger")
       return
     }
     console.log(" jan Aadhar memberId",this.familyDetails.getRawValue().memberId);
     
     if(this.familyDetails.getRawValue().memberId == null || this.familyDetails.value.memberId == ''|| this.familyDetails.value.memberId == '0'){
      this.snackbar.show("Please select member...","danger")
       return
     }
    if (this.familyDetails.invalid) { 
      alert("Please ensure that all fields are filled correctly and completely")
      return }
      if(this.familyDetails.getRawValue().relationship.relationId == undefined)
      { 
        alert("Please fill Relationship.")
        return }

        let gName = this.getGenderList.filter(x=>x.genId == this.familyDetails.getRawValue().gender)
        
    if (this.IsEdit) {
      const family = this.EmployeeFamilyDetails.familyDetails[this.index];
      console.log("family>>>>>>>>>>", family);
      
      this.EmployeeFamilyDetails.familyDetails[this.index] = {
        ...this.familyDetails.value,
        familyMemId: family.familyMamId || family.familyMemId,
        relationshipName:this.familyDetails.getRawValue().relationship.rNameEn,
        relationship:this.familyDetails.getRawValue().relationship.relationId,
        familyActive: "1",
        isNew: family.isNew,
        genderName:gName[0].genNameEn,
       // genderName:this.familyDetails.getRawValue().gender.genNameEn,
        genderId:this.familyDetails.getRawValue().gender,
      };
      if(this.EmployeeFamilyDetails?.nomineeDetails.length)
      {
            this.EmployeeFamilyDetails.nomineeDetails.forEach((element:any,i:any) => {
          if(element.familyMemId==family.familyMamId || family.familyMemId)
          {
           
            this.EmployeeFamilyDetails.nomineeDetails[i].nameOfNominee=this.familyDetails.value.name
          }
        });
      }
     
      this.familyDetails.reset();
    } else {
      const id = this.getRandom();
      this.EmployeeFamilyDetails.familyDetails.push({
        ...this.familyDetails.value,
        familyMemId: id,
        relationshipName:this.familyDetails.getRawValue().relationship.rNameEn,
        relationship:this.familyDetails.getRawValue().relationship.relationId,
        familyActive: "1",
        isNew: 1,
        genderId:this.familyDetails.getRawValue().gender,
        genderName:gName[0].genNameEn,
      });
      this.familyDetails.reset();
    }
    this.IsEdit = false;
    this.familyDetails.reset();
    this.frmNominee.reset();

    console.log(this.EmployeeFamilyDetails)
  }

  edit = (index: number) => {
    debugger;
    this.IsEdit = true;
    this.index = index;
    this.familyDetails.patchValue({maritalStatus:""})
    const data = this.EmployeeFamilyDetails.familyDetails[index];
    console.log("asda",data)
   
      if(data.physicallyDisabled=='1')
      {
        this.familyDetails.controls['percentageOfDisability'].setValidators([Validators.required]);
        this.familyDetails.controls['percentageOfDisability'].updateValueAndValidity();
      }else
      {
        data.physicallyDisabled=='0'
      }
    this.getJanaadhaar(data.janAadharId)      //data.genderId;
    // this.getRelation();
    // this.familyDetails.get('relationship')?.patchValue( parseInt(data.relationship));

    this.familyDetails.patchValue({ ...data,
      familyMemId:data.familyMamId || data.familyMemId,
      memberId:data.memberId,
      gender:data.genderId,
      dob: new Date(data.dob),
  })
      if(data.relationship=='5' || data.relationship=='8')
      {
        this.familyDetails.patchValue({maritalStatus:1})
      }
      
  }

  remove = (index: number) => {
    // const data = this.EmployeeFamilyDetails.familyDetails[index];
    // console.log(data)
    // if (data.isNew === 0) {
    //   data.familyActive = 0
    // } else {
      this.EmployeeFamilyDetails.familyDetails.splice(index, 1);
    // }
  }

  getGenderName = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null)
      return this.getGenderList.filter((x: any) => x.genId == id)[0]?.genNameEn;
  }

  getRelationName = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null )
      return this.getRelationList.filter((x: any) => x.relationId == id)[0]?.rNameEn;
  }
  getRelationNameFamily = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null)
      return this.getRelationList.filter((x: any) => x.relationId == id)[0]?.rNameEn;
  }
  getRelationByName = (id: number) => {
    if (id !== undefined && id !== 0 && id !== null)
      return this.FamilyRelationAlllist.filter((x: any) => x.relationId == id)[0]?.relationNameEn;
  }

  getFamilyList(data:any){
    console.log("datadatadatadata",data.filter((item:any)=> item.familyActive === "1"));
    
    return data.filter((item:any)=> item.familyActive === "1");
  }

  geNomineeList(data:any){
    if(data === null) {data = [], this.EmployeeFamilyDetails.nomineeDetails = []}
    return data.filter((item:any)=> item.nomineeActive === 1);
  }
  getRelationList1:any;
  getrelationList(event:any)
  {
      this.getRelationList1=this.EmployeeFamilyDetails.familyDetails.filter((item:any)=>item.familyMemId || item.familyMamId ==event);
      console.log("getRelationList1",this.getRelationList1)
      this.frmNominee.patchValue({relation:this.getRelationList1[0].relationship})
  }

 
addNominee:boolean=true;
isNomSch:boolean=false;

  saveNominee() {
    let addNomData:any;
    debugger;
   this.isNomSch=false;
   if(this.frmNominee.value.schemes == null || this.frmNominee.value.schemes ==''){
    this.snackbar.show("Please select Scheme...","danger")
     return
   }
    if(this.frmNominee.value.share>100)
    {
     this.frmNominee.patchValue({
       share:""
     })
     this.addNominee=false;
     this.snackbar.show("Please Enter Share value between 1 to 100","danger")
     return
    }
    if(this.frmNominee.value.share<1)
    {
     this.frmNominee.patchValue({
       share:""
     })
     this.addNominee=false;
     this.snackbar.show("Please Enter Share value between 1 to 100","danger")
     return
    }
    // let SchmeName = this.getSchemeTypeListnew.filter((x:any)=>x.schNomId == this.frmNominee.getRawValue().schemes);
    // console.log("SchmeName>>>>>>>>>>>", SchmeName);
    if(this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).length>=1){
    
      let schNomList=this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).filter((x:any)=>x.schemes==this.frmNominee.value.schemes)
      console.log("schNomList",schNomList);
      if(schNomList.length>=1)
      {
        let totalShare:any=0;
        for(let r of schNomList)
        { 
          
          totalShare=totalShare+r.share;  
               
          if(r.familyMemId==this.frmNominee.value.familyMemId && !this.IsEdit)
          {
            this.isNomSch=true;
            addNomData=r;
            
          }
         
        }
       
        if(this.IsEdit)
        {
          
          totalShare=totalShare-this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[this.index].share;
         
        }  
       
        if(Number(totalShare)>100)
        {
          this.addNominee=false;
          this.snackbar.show("Scheme Share limit cannot be exceed above 100%","danger")
          return;
        }
       
      }
    }
    

    if(this.addNominee)
    {
      const empFam  = this.EmployeeFamilyDetails.familyDetails.filter((item:any)=>item.familyMemId || item.familyMamId=== this.frmNominee.value.familyMemId)[0];
debugger;
      if (this.IsEdit) {
       
        this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[this.index].share = this.frmNominee.value.share
        this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[this.index].nameOfNominee= this.getFamilyList(this.EmployeeFamilyDetails?.familyDetails).filter((x:any)=>x.familyMemId==this.frmNominee.value.familyMemId)[0].name
        console.log("nomineeDetails1",this.EmployeeFamilyDetails.nomineeDetails)
        this.IsEdit=false;
      } else if(this.isNomSch)
      {
       for(let i=0;i<this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).length;i++)
       {
        if(
          addNomData==this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[i]
        )
        {
          
          this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[i].share= this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[i].share+this.frmNominee.value.share;
          this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[i].nameOfNominee= this.getFamilyList(this.EmployeeFamilyDetails?.familyDetails).filter((x:any)=>x.familyMemId==this.frmNominee.value.familyMemId)[0].name
          
          console.log("nomineeDetails2",this.EmployeeFamilyDetails.nomineeDetails)
        }
       }
      }
      else {
        console.log(this.frmNominee.value)
        this.EmployeeFamilyDetails.nomineeDetails.push({
           ...this.frmNominee.value, 
           nameOfNominee: empFam.name,
           schemeNomId: 0, 
           nomineeActive: 1,
           isNew: 1 
          })
      }
      this.IsEdit = false;
      this.frmNominee.patchValue({
        schemes: [''],
        nameOfNominee: [''],
        relation: [''],
        share: [''],
        familyMemId: ['']
      })
    }
    
  }

  edit1 = (index: number) => {
    this.IsEdit = true;
    this.index = index;
    const data = this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[index];

    this.frmNominee.patchValue({ ...data })
    this.getrelationList(Number(data.familyMemId))
    this.frmNominee.patchValue({familyMemId:data.familyMemId,relation:data.relation  })
    
  }
  remove1 = (index: number,item:any) => {
   

   for(let i=0;i<this.EmployeeFamilyDetails.nomineeDetails.length;i++)
   {
    if(this.EmployeeFamilyDetails.nomineeDetails[i]==item)
    {
      console.log("aa",this.EmployeeFamilyDetails.nomineeDetails)
        this.EmployeeFamilyDetails.nomineeDetails.splice(i,1)
        console.log("bb",this.EmployeeFamilyDetails.nomineeDetails)
    }
    this.IsEdit=false
   }

    // if (data.isNew === 1) {
      // console.log("nomineeDetails1",this.EmployeeFamilyDetails.nomineeDetails)
      // console.log("nomineeDetails2",this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails))
      // this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).splice(index, 1);
      // console.log("nomineeDetails3",this.EmployeeFamilyDetails.nomineeDetails)
      // console.log("nomineeDetails4",this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails))
    //   data.familyActive = 0
    // } else {
    //   data.nomineeActive = 0
    // }
  }


  onItemChange(event: any) {
    if (event.value == false) {
      this.familyDetails.controls['percentageOfDisability'].disable();

    }
    else {
      this.familyDetails.controls['percentageOfDisability'].enable();

    }
  }

  onItemChanges(event: any) {
    if (event.value == false) {
      this.familyDetails.controls['govEmployee'].disable();
    }
    else {
      this.familyDetails.controls['govEmployee'].enable();
    }
  }
  checkShare(i:any)
  {
    this.addNominee=true
   if(i>100)
   {
    this.frmNominee.patchValue({
      share:""
    })
    this.snackbar.show("Please Enter Share value between 1 to 100","danger")
    return
   }
   if(i<1)
   {
    this.frmNominee.patchValue({
      share:""
    })
    this.snackbar.show("Please Enter Share value between 1 to 100","danger")
    return
   }
    
    if(this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).length>=1){
     
      let schNomList=this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails).filter((x:any)=>x.schemes==this.frmNominee.value.schemes)
      console.log("schNomList",schNomList);
      if(schNomList.length>=1)
      {
        let totalShare:any=0;
        for(let r of schNomList)
        {
          totalShare=totalShare+r.share;
          
        }
        if(this.IsEdit)
          {
            
            totalShare=totalShare-this.geNomineeList(this.EmployeeFamilyDetails.nomineeDetails)[this.index].share;
            console.log("totalshare1",totalShare)
          }  
        totalShare=totalShare+Number(i);

        console.log("totalshare",totalShare)
        if(Number(totalShare)>100)
        { this.frmNominee.patchValue({
          share:""
        })
        this.snackbar.show("Scheme Share limit cannot be exceed above 100%","danger")
          return;
        }
       
      }
    }
   

   
   
  }

  savealternateNominee() {
    if (this.alternateNominee.invalid) { return }
    const data = this.EmployeeAlternateyDetails.alternateNominee.filter((x: any) => x.schemes === this.alternateNominee.value.schemes);
    // var oldest_person = data.reduce((a:number, b:number) => a.schemes > b.Age ? a : b );

    if (this.IsEdit) {

      this.EmployeeAlternateyDetails.alternateNominee[this.index] = this.alternateNominee.value;
    } else {
      this.EmployeeAlternateyDetails.alternateNominee.push(this.alternateNominee.value);
    }
    this.IsEdit = false;
    this.alternateNominee.reset();

  }

  editAlternate = (index: number) => {
    this.IsEdit = true;
    index = index;
    const data = this.EmployeeAlternateyDetails.alternateNominee[index];

    this.frmNominee.patchValue({ ...data })
  }
  removeAlternate = (index: number) => {
    this.EmployeeAlternateyDetails.alternateNominee.splice(index, 1);
  }

  checkValidateFamily() {
    this.EmployeeFamilyDetails.familyDetails.forEach((item: any) => {
      if (item.name == '' || item.relationship == null || item.relationship == 0 || item.dob == '' || item.gender == null || item.gender == 0 || item.maritalStatus == null || item.maritalStatus == 0) {
        this.snackbar.show('Please add Family Details and Nominee Details', 'danger');
      }
    });
  }

  getRandom() {
    return Math.floor(Math.random() * 10000000000);
  }

getSchemeName(schemeid:any)
{
return this.getSchemeTypeList.filter((x:any)=>x.schNomId==schemeid)[0].schNomNameEn
}





  //4807772669
  getJanaadhaar = (value: any) => {
    this.janaadhaarList=[];
    this.apiService.postIfms('janaadhaar/familyinfo', { janAadharId: value, enrId: 0, aadharId: 0 }).subscribe({
      next: (res:any) => {
        if(res.root.personalInfo !=undefined){
        const data = res.root.personalInfo.member;
        console.log("list", data)
        if (Array.isArray(data)) {
          this.janaadhaarList = data;
        } else {
          this.janaadhaarList = [];
          this.janaadhaarList.push(data);
        }
        this.JanaadhaarUser.emit(this.janaadhaarList);
        }
      }
    })

  }

  isDisabled:boolean=false
  disabledChange(i:any)
  {
    if(this.familyDetails.value.physicallyDisabled=='1')
    {
      this.isDisabled=true;
      this.familyDetails.controls['percentageOfDisability'].setValidators([Validators.required]);
    }else
    {
      this.isDisabled=false;
      this.familyDetails.controls['percentageOfDisability'].clearValidators();
    }
    this.familyDetails.controls['percentageOfDisability'].updateValueAndValidity();
      this.familyDetails.patchValue({
        percentageOfDisability:""
      })

  }
  checkRange()
  {

    if(this.familyDetails.value.percentageOfDisability<40 || this.familyDetails.value.percentageOfDisability>100)
    {
      alert("Please enter between 40 to 100");
      this.familyDetails.patchValue({
        percentageOfDisability:""
      })
    }
  }
  isHead:boolean=false
  changeMember = () => {
    this.familyDetails.patchValue({
      name: '',
      fatherName: '',
      motherName: '',
      dob: '',
      relationship: '',
      gender:'',
      maritalStatus:'',
      mobileNumber: '',
      aadharRefNo: '',
      pan: ''
      // gender: data.panNo
    });
    this.isHead=false;
    const data = this.janaadhaarList.filter(x => x.jan_mid === this.familyDetails.value.memberId)[0];
    debugger;
    if(this.familyDetails.value.memberId==0)
    {
      this.isHead=true;
      this.familyDetails.patchValue({memberId:data.hof_jan_m_id})
    }
    if(data !=undefined){
      const dobParts = data.dob.trim().split('/'); // Assuming date is separated by slashes
      const day = parseInt(dobParts[0], 10);
      const month = parseInt(dobParts[1], 10);
      const year = parseInt(dobParts[2], 10);
    
    const dob = new Date(year, month-1, day);
    this.familyDetails.patchValue({
      name: data.nameEng,
      fatherName: data.fnameEng,
      motherName: data.mnameEng,
      dob: dob,
      mobileNumber: data.mobile,
      aadharRefNo: data.aadhar,
      pan: data.panNo
      // gender: data.panNo
    });
  }
   
  }
  changeAlternateMember = () => {
    const data = this.janaadhaarList.filter((x:any) => x.jan_mid==0?x.hof_jan_m_id:x.jan_mid === this.alternateNominee.value.memberId)[0];
    console.log(data)

  }
////////////////// Office Data is Add 04/10/2023 // ///
officeData:any={};
  pofficeId:any;
  oOfficeId:any;
  checkOfficeId(i:any)
  {
    debugger;
    let data:any;
    if(i==1)
    {
      if(this.oOfficeId==null || this.oOfficeId=='')
      {
        alert("Insert office id")
        
      }
      data = {
        "inMstType":28,
        "inValue":this.oOfficeId,
        "inValue2":0,
        "inValue3":""
        }
       // this.payEntitlement.patchValue({newPensionInitOffice : this.oOfficeId});

    }else if(i==2)
      {
        data = {
          "inMstType":28,
          "inValue":this.pofficeId,
          "inValue2":0,
          "inValue3":""
          }
      }else if(i==3)
      {
        data = {
          "inMstType":28,
          "inValue":this.userdetails[0].officeId,
          "inValue2":0,
          "inValue3":""
          }
      }
   console.log("check office",data);
   this.apiService.postWf('allmstdata', data).subscribe({
    next: (res:any) => {
      
      if (res.status = 200) {
       let data1 = JSON.parse(res.data);
        console.log("check res",data1)
        if(data1!=null)
        {
          this.officeData.officeHoName=data1[0]?.officeHoName;
          this.officeData.officeId=data1[0]?.officeId;
          this.officeData.officeName=data1[0]?.officeName;
          if(data1[0]?.officeHoName==null )
          {
            alert("HO is not present in this office. Kindly contact the respective Office.")
          }
        }else
        {
          alert("Please insert right office id and try again or you can used 'Do'nt Know' option.")
        }
      }
    },

  })
  }
  departmentList:any;
  searchdepartment = new FormControl();
  serchOffice = new FormControl();
  officeList:any
  getOfficeList()
  {
    let data = {
      "inMstType":22,
      "inValue":this.pdeptId,
      "inValue2":0,
      "inValue3":""
      }
    this.apiService.postWf('allmstdata', data).subscribe({
      next: (res:any) => {
        
        if (res.status = 200) {
          this.officeList = JSON.parse(res.data);
          console.log("this.officeList",this.officeList)
          this.$serchOffice = this.serchOffice.valueChanges.pipe(
            startWith(null),
            debounceTime(200),
            switchMap((res: any) => {
              if (!res) return of(this.officeList);
              let fff = res;
              //console.log("shyam",fff);
              return of(
                 this.officeList.filter(
                    (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0
  
                 )
              );
            })
          );
        }
      },
  
    })
  }
  getDepartmentList()
  {
    let data = {
      "inMstType":21,
      "inValue":0,
      "inValue2":0,
      "inValue3":""
      }
    this.apiService.postWf('allmstdata', data).subscribe({
      next: (res:any) => {        
        if (res.status = 200) {
          this.departmentList = JSON.parse(res.data);
          console.log("this.officeList",this.departmentList)
          this.$searchdepartment = this.searchdepartment.valueChanges.pipe(
            startWith(null),
            debounceTime(200),
            switchMap((res: any) => {
              if (!res) return of(this.departmentList);
              let fff = res;
              //console.log("shyam",fff);
              return of(
                 this.departmentList.filter(
                    (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0
  
                 )
              );
            })
          );

        }
      },
  
    })
  }
  $searchdepartment = this.searchdepartment.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.departmentList);
      let fff = res;
      //console.log("shyam",fff);
      return of(
         this.departmentList.filter(
            (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0

         )
      );
    })
  );

  $serchOffice = this.serchOffice.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.officeList);
      let fff = res;
      //console.log("shyam",fff);
      return of(
         this.officeList.filter(
            (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0
         )
      );
    })
  );
  pdeptId:any

selectOption(event: any){
  this.checkOfficeId(3);  
  if(event.value == 1){
    this.isOffice = true;
    this.isOfficeShow=true;
    this.isList=false
    this.isKnow=false
   this.pensionInitOffice=this.office;
  }else{
    this.isOfficeShow=false;
    this.isOffice = false;
    this.isKnow=true
    this.isList=true      
  }
}
isKnow:boolean=false
isList:boolean=false
selectOption2(event: any){
  if(event.value == 1){
   
    this.isList=true
  }else{
   
    this.isList=false
  }
}




/////// Office data close ////


// photo upload 
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
    console.log("res", res.data.document[0].content);
    if (res.data.document[0].content) {
      this.jointImageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
    }
  })
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
      alert(res.data.document[0].docTitle + " Uploaded succesfully..") 
      if (res.data.document[0].docId)
       {       
        this.dmsDocId=res.data.document[0].docId;

       }
    })
  };
  reader.readAsDataURL(this.file);  
}

uploadFile1(event: any) {

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
    this.imageUrl=data5;
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
          "docTitle": "Employee Photograph",
          "content": data5
        }
      ]
    }   
    console.log(this.jointImageUrl)
    this.apiService.postIntegration("wcc/uploaddocs", data).subscribe((res: any) => {
      console.log(res.data.document[0].docId)

      alert(res.data.document[0].docTitle + " Uploaded succesfully..") 

      if (res.data.document[0].docId)
       {       
        this.dmsdocidEmp=res.data.document[0].docId;

       }
    })
  };
  reader.readAsDataURL(this.file);  
}


updateJointPhoto(){
  // this.bankVerify=2;
  // this.verifyMobileNo();
  this.updateverifyJointPhoto();
}
updateverifyJointPhoto(){
  let uploadData={
  "empCode":this.pensionerDtls.employeeCode,
  "psnId": parseInt(this.pensionerDtls.pensionerId),
   "docitem": [
        {
          "docTypeId": 32,
          "createUid": this.pensionerDtls.pensionerId,
          "createAid":this.pensionerDtls.pensionerId,
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
  

  //saveDraft = () => 
   saveDraft() {
    debugger;
    //console.log("sunn05 6526d526i250+kh jaa na",this.dmsDocId)
    // if(this.dmsDocId ===undefined || this.dmsDocId ===''){
    //   alert('Please Upload Joint Photo.....')
    //   return;
    // }
    // if(this.dmsdocidEmp ===undefined || this.dmsdocidEmp ===''){
    //   alert('Please Upload Employee Photo.....')
    //   return;
    // }
    if(this.dmsDocId > 0){
      var docId =  this.dmsDocId;
        
    }else{
      var docId =this.pensionerDtls[0].jointPhotoGraph;
    }

    if(this.dmsdocidEmp > 0){
      var dmsdocidEmp =  this.dmsdocidEmp;
        
    }else{
      var dmsdocidEmp =this.pensionerDtls[0].employeePhotoGraph;
    }


    var postData={
      
      "JointPhoto": {
       "empCode":this.pensionerDtls[0].employeeCode,
       "psnId": parseInt(this.pensionerDtls[0].pensionerId),
        "docitem": [
        {
          "docTypeId": 32,
          "createUid": this.pensionerDtls[0].pensionerId,
          "createAid":this.pensionerDtls[0].pensionerId,
            "dmsdocid":docId
        }
      ]
    },
    "EmployeePhoto": {
      "empCode":this.pensionerDtls[0].employeeCode,
      "psnId": parseInt(this.pensionerDtls[0].pensionerId),
       "docitem": [
       {
         "docTypeId": 34,
         "createUid": this.pensionerDtls[0].pensionerId,
         "createAid":this.pensionerDtls[0].pensionerId,
           "dmsdocidEmp":dmsdocidEmp
       }
       ]
     }, 
      "familyDetailsList":this.EmployeeFamilyDetails?.familyDetails,
      "NomineeDetailsList":this.EmployeeFamilyDetails.nomineeDetails,
      "IsApproved": '0',
      "officeId":this.officeData.officeId,
    }
   console.log("postData==>>>>>>>",postData);
   
  //  return false; 
   var url = this.apiurl.url.submitfamilydtlspensionerwise;    
   this.api.postpension(url, postData).subscribe((res: any) => {
     console.log("Family Details Seen Data >>>>>", res);
     alert(res.data)      
   })
   return false;
   }
}











