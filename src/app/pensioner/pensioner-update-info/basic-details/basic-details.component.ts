import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit {

  @Input() personal: Subject<boolean>;
  @Input() masterData: any;
  @Output() BasicDetailsUser = new EventEmitter();
  @Output() EmpData = new EventEmitter();



  basicDetailsForm: FormGroup;

  action = '';

  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {

    this.basicDetailsForm = this.fb.group({

      aadharNumber: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      panNo: ['', Validators.required],

    });

console.log(this.masterData);

    this.basicDetailsForm.controls['mobileNumber'].setValue(this.masterData?.MOB_NO )
    this.basicDetailsForm.controls['panNo'].setValue(this.masterData?.PAN )
    let basicDetailsFormData = this.basicDetailsForm;
    this.BasicDetailsUser.emit(basicDetailsFormData);
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


  onSubmit(){
    console.log(this.basicDetailsForm.value)
    if(this.basicDetailsForm.valid){
      let basicDetailsFormData = this.basicDetailsForm;
  
      this.BasicDetailsUser.emit(basicDetailsFormData);
    
      const data = { step: 1, value: basicDetailsFormData, action: this.action, validate: true }
    
      // this.EmpData.emit(data);

    }
  
  
  
  
  }

}
