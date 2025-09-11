import { Component, OnInit, ViewChild } from '@angular/core';

import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
declare var $: any;
@Component({
  selector: 'app-otp-window',
  templateUrl: './otp-window.component.html',
  styleUrls: ['./otp-window.component.scss']
})
export class OtpWindowComponent implements OnInit {
  otp: string = '';
  showOtpComponent = true;
  display = "none";
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput:NgOtpInputComponent | undefined;
  config :NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };
  constructor() { }

  ngOnInit(): void {
  }

  

  onCloseHandled() {
    this.display = "none";
  }


  onOtpChange(otp: any) {
    this.otp = otp;
  }

  setVal(val: any) {
    this.ngOtpInput?.setValue(val);
  }

  toggleDisable(){
    if(this.ngOtpInput?.otpForm){
      if(this.ngOtpInput?.otpForm.disabled){
        this.ngOtpInput?.otpForm.enable();
      }else{
        this.ngOtpInput?.otpForm.disable();
      }
    }
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = '';
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }

}
