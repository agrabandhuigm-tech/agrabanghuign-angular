export class UserSessions
{
    public Token:string='';
    public  UserName:string='';
    public  UserNameHi:string='';
    public  SSOId:string='';
    public  UserId :number=0;
    public  EmailId:string='';
    public  RoleId:number=0;  
}
export class SubMenuActionMaster 
{
    public ID: number = 0;
    public NAME: string = '';
    public ISCHECKED: boolean = false;
}



export class PayeeRegistrationDetails 
{
    public aadharRefId: string = '';
    public blockId: string = '';
    public blockNameEn: string = '';
    public blockNameHi: string = '';
    public category: string = '';
    public categoryId: any = '';
    public cin: string = '';
    public cityId: any = '';
    public cityNameEn: string = '';
    public cityNameHi: string = '';
    public distNameEn: string = '';
    public distNameHi: string = '';
    public districtId: any = '';
    public dob: any;
    public emailId: string = '';
    public firmName: string = '';
    public firstName: string = '';
    public gender: string = '';
    public gramPId: any = '';
    public gramPNmEn: string = '';
    public gramPNmHi: string = '';
    public gstDate: any = '';
    public gstin: string = '';
    public isNri: string = '';
    public janAadharAckId: string = '';
    public janAadharId: string = '';
    public janMid: string = '';
    public lastName: string = '';
    public mobileNo: string = '';
    public nameHi: string = '';
    public panNo: string = '';
    public passportNo: string = '';
    public postalCode: string = '';
    public regAddress: string = '';
    public regBankData: any = [];
    public remarks: string = ''
    public ru: string = '';
    public ssoId: string = '';
    public stNameEn: string = '';
    public stNameHi: string = '';
    public stateId: string = '';
    public status: string = '';
    public subCategory: string = '';
    public subCategoryId: string = '';
    public tanNo: string = '';
    public telephoneNo: string = '';   
    public vendorOrgId: string = '';
    public userNo: any = '';
    public villageId: any = '';

}

export class BankDetails 
{
    accName: string = '';
    bankAccountNumber: string = '';
    bankBranchId: string = '';
    bankDoc: any ='';
    bankId: string ='';
    bankNameEn: string  = '';
    bankNameHi: string  = '';
    branchNameEn:  string  = '';
    docType:string= '';
    ifscCode: string = '';
    makePrimary: boolean = false;
}


export class PaymentSanctionrequest{
    regData: any = {};
      paymentSanctionHdr:any = {};
      paymentSanctionListDtl:any= [];
      document: string = '';
      approveRemarks: string = '';
      schemeCode: string = '';
      billType:string = '';
}


export class PaymentSanctionView{
    public sanctionNumber: string ='';
    public sanctionDate: string ='';
    public officeName: string ='';
    public deptName: string ='';
    public document: string ='';
    public ddoName: string ='';
    public ddoCode: string ='';
    public budgetHead: string ='';
    public schemeName: string ='';
    public schemeCode: string ='';
    public objectHead: string ='';
    public billType: string ='';
    public billSubType: string ='';
    public purposeOfSanction: string ='';
}

export class Menu 
{
    public menuId:number=0;
    public nameEn:string='';
     public nameHi:string='';
    public navigateUrl:string='';
     public MenuIcon:string='';
     public parentId:number=0;
     public orderNo:number=0;
    public isActive:boolean=false ;
    public MenuActionIds:string='';
     public entsubmenuaction: Array<SubMenuActionMaster> = [];
}  



