import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModalComponent } from '../common-modal/common-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-service-provider-website-success',
  templateUrl: './service-provider-website-success.component.html',
  styleUrls: ['./service-provider-website-success.component.scss']
})
export class ServiceProviderWebsiteSuccessComponent implements OnInit {
  //paramsObject:any;
  isModalOpened = false;

  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    const queryParams = this.activatedRoute.snapshot.queryParams;
    const refNo = queryParams['refNo'];
    const actionType = queryParams['actionType'];
    const tranId = queryParams['tranId'];
    const tranStatus = queryParams['tranStatus'];
    const utrNo = queryParams['utrNo'];


    console.log('refNo:', refNo);
    console.log('actionType:', actionType);
    console.log('tranId:', tranId);
    console.log('tranStatus:', tranStatus);
    console.log('utrNo:', utrNo);

    if (!this.isModalOpened) {
      this.isModalOpened = true;
       setTimeout(() => {
        this.openModal(queryParams);
      }, 200);
    }
  }

  openModal(queryParams:any) {

      const modalId = this.getModalId(queryParams.actionType, queryParams.tranStatus);
      const confirmDialog = this.dialog.open(CommonModalComponent, {
        disableClose: true,
        panelClass: 'small-dialog',
        autoFocus: false,
        data: {
          referenceId: queryParams.refNo,
          actionType: queryParams.actionType,
          tranId: queryParams.tranId,
          tranStatus: queryParams.tranStatus,
          utrNo: queryParams.utrNo,
          action: '',
          id: modalId,
        },
      });

      confirmDialog.afterClosed().subscribe((data) => {

        //this.router.navigate(['/dashboard']);
      
      
      });
    
  }

  getModalId(actionType:any, tranStatus:any){
    if(actionType === 'WTH'){
      if(tranStatus === 'Success'){
        return 'service-provider-redirection-callback-wth-success';
      } else {
        return 'service-provider-redirection-callback-wth-failed';
      }
    } else if(actionType === 'KYC') {
      if(tranStatus === 'Success'){
        return 'service-provider-redirection-callback-kyc-success';
      } else {
        return 'service-provider-redirection-callback-kyc-failed';
      }
    }
    return  'service-provider-redirection-callback-wth-failed';
  }


}
