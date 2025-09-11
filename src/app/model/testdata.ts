export class  MenuElement{
  public MenuId: number = 0;
  public MenuActionIds: number = 0;
  public MenuNameEn: string = '';
  public ParentMenuName: string = '';
   public IsActive: boolean = false;
    
  }

  export class  state{
    public stateId: string = '';
    public stNameEn: string = '';
    public stNameHi: string = '';
    }
    export interface VenderData {
      PAYEE_TYPE:string;
       NAME:string;
       NAME_HI:string;
       JAN_MID:string;
       AADHAR_REF_ID:string;
       PAN_NO:string;
       MOBILE_NO:string;
       EMAIL_ID:string;
       TAN_NO:string;
       PAYEE_BANK:string;
       BANK_BRANCH:string;
       ACCOUNT_No:string;
       REQUEST_Date:string;
       STATUS:string
   }
   export interface BeneficiaryData {
    sr_No:string;
    payee_id:string;
    janadhaar_id:string;
    janadhar_member_id:string;
    bank_name:string;
    branch_name:string;
    account_number:string;
    mobile_number:string;
    name_of_payee:string;
    email_id:string;
    net_payment:string;     
 }


 export interface UserDetail {
  sr_No:string;
  officer_name:string;
  mobile_no:string;
  level:string;
  work_space:string;
  office:string;
  designation:string;
  role:string;
  post :string;
  main_charge:string;
  show_role:string;     
}
export interface PendingBill {
  reference_no:string;
  request_description:string;
  initiator:string;
  initited_date:string;
  received_from:string;
  pending_since:string;
  status:string;
 }