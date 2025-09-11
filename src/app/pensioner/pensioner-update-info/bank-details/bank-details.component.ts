import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {

  @Input() personal: Subject<boolean>;
  @Output() BankDetailsUser = new EventEmitter();
  @Output() EmpData = new EventEmitter();
  @Input() masterData: any;
  bankDetailsForm: FormGroup;
  BankdetailsByIfsc:any;
  action = '';

  constructor(private fb: FormBuilder,public apiurl: ApiUrlService,public api:ApiService,) { 

  }

  ngOnInit(): void {

    this.bankDetailsForm = this.fb.group({

      accountNo: ['', Validators.required],
      confirmaccountNo: ['', Validators.required],
      ifscCode: ['', Validators.required],
      bankName: ['', Validators.required],
      bankBranchName: ['', Validators.required],
   

    });

    console.log(this.masterData);

    this.bankDetailsForm.controls['accountNo'].setValue(this.masterData?.ACCOUNT_NO )
    this.bankDetailsForm.controls['confirmaccountNo'].setValue(this.masterData?.ACCOUNT_NO )
    this.bankDetailsForm.controls['ifscCode'].setValue(this.masterData?.IFSC_CODE )
    this.bankDetailsForm.controls['bankName'].setValue(this.masterData?.BANK_NAME)
    this.bankDetailsForm.controls['bankBranchName'].setValue(this.masterData?.BRANCH_NAME )

    let bankDetailsFormData = this.bankDetailsForm.value;

    this.BankDetailsUser.emit(bankDetailsFormData);
    this.personal.subscribe(v => { 
      this.onSubmit();
    });



  }


  
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  alphaNumberOnly (e:any) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    // var regex = new RegExp("^[A-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      //  var upperChar = str.toUpperCase();
    // if (regex.test(upperChar)) {
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
  }

   // Get Bank details by ifsc // Start // 12/07/2023// 
 bankdetailsbyifsc(){
  var url = this.apiurl.url.bankdetailsbyifsc;
  console.log("ifscCode==>>",this.bankDetailsForm.get('ifscCode')?.value);
  var data = {    
   "ifscCode": this.bankDetailsForm.get('ifscCode')?.value    
  };
 //  alert(this.getbankaccountdetls.ifscCode)
   if(data.ifscCode.length>9){
  this.api.postpension(url, data).subscribe((res: any) => {
    console.log("result>>>", res);
    this.BankdetailsByIfsc=res.data[0];  
   //console.log("BankdetailsByIfsc==>>",this.BankdetailsByIfsc);      
   this.bankDetailsForm.get('bankName')?.patchValue(this.BankdetailsByIfsc?.bankNameEn);
   this.bankDetailsForm.get('bankBranchName')?.patchValue(this.BankdetailsByIfsc?.branchNameEn);
   }) 
 } 
 //this.updatebankdetails();
 
}
// Get Bank details by ifsc // End  // 


onSubmit(){
  console.log(this.bankDetailsForm.value)

  let bankDetailsFormData = this.bankDetailsForm.value;

  this.BankDetailsUser.emit(bankDetailsFormData);

  const data = { step: 1, value: bankDetailsFormData, action: this.action, validate: true }

  // this.EmpData.emit(data);


}

}
