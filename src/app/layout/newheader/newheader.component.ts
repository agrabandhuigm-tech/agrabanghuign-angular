import { Component, OnInit } from '@angular/core';
import { userInfo } from 'os';
// import { PensionServiceService } from 'src/app/services/pension-service.service';
import jwt_decode from 'jwt-decode';
import { AppConfig } from 'src/app/app.config';
import { Router, RouterLink } from '@angular/router';
import { log } from 'console';
import { MatDialog } from '@angular/material/dialog';

//  import { RoleDialogComponent } from 'src/app/pension/role-dialog/role-dialog.component';
//  import { TokenManagementService } from 'src/app/services/token-management.service';


@Component({
  selector: 'app-newheader',
  templateUrl: './newheader.component.html',
  styleUrls: ['./newheader.component.scss']
})
export class NewheaderComponent implements OnInit {
  userEmp_Details:any
  empinfo:any;
  makerToken:any;
  userDetails:any={};
  config:AppConfig=new AppConfig();
  roleList:any[]=[
  ];
  userName:any;
  selectedrole:any;
  ssoimg:any;
  
  constructor(
    //  private _Service:PensionServiceService,
    // public router:Router,
    // public dialog:MatDialog,
    // private tokenInfo:TokenManagementService
    ) {
    
    // let purl: string = this.router['location']._platformLocation.location.origin;
    // let url2: string = this.router.url;
    // let mainUrl = purl + "/#" + url2;
    //alert(url2)
    
    // if(url2=="/")
    // {     
    //   this.getRoleNew("57698");
    // }else
    // {
      // this.getRoleNew(this.userDetails.assignmentid);
    // }
    
   
  }

  ngOnInit(): void {
   
  //   this.makerToken = sessionStorage.getItem('MpJwtToken');
  //   //this.makerToken=localStorage.getItem('mpJWTToken');
  //   // alert(this.makerToken);
  //   console.log(this.makerToken);
    
  //   this.getDecodedAccessToken(this.makerToken);
  //   this.empinfo=this.tokenInfo.empinfoService;
  //   console.log("emptoken",this.empinfo.aid)
  //   this.ssoimg = sessionStorage.getItem("ssoimg");
  //   if (!this.ssoimg) {
  //     this.ssoimg = "assets/images/male-avatar.png"
  //   }
  //   this.userDetails = this.config.getUserDetails();
  //  console.log("this.userDetails", this.userDetails);
  //  this.selectedrole = this.userDetails.role;
  //   console.log("this.Rolename", this.userDetails);
  //   if(this.userDetails.assignmentid)
  //   {
  //     this.getRoleNew();
  //   }
  //   else{
  //     this.userDetails.assignmentid=this.empinfo.aid
  //     this.getRoleNew();
  //   }
    
    //this.fetchServicesdetail();

   
  }
//   logout1()
//   {
//     if(confirm("Are you sure you want to log out?"))
//     {
//       sessionStorage.clear();
//       localStorage.clear();
//       let purl: string = this.router['location']._platformLocation.location.origin;
   
//       window.location.href=purl+"/ifmssso/"
//     }
   
//   }
//   getRoleNew()
//   {
//       var url="getuserpayeerolebyassignmentid";
//     var data={
//       "assignmentId":this.empinfo.aid           
//     };

//     this._Service.postho(url,data).subscribe((res: any) => {
      
//       console.log("rolelist11",res);
//       if(res.status=='SUCCESS')
//       {
//         let data:any[]=res.data;
//         if(data){
//         for(let i=0;i<data.length;i++)
//         {
//            if(i==0)
//            {
//              this.roleList.push(data[i]);             
//            }else
//            {
//             console.log("zzzzzzzzzzzzz",this.roleList.length);
//             let count=0;
//              for(let j=0;j<this.roleList.length;j++)
//              {
//               console.log("this.roleList[j].payeeRoleName",this.roleList[j].payeeRoleName+data[i].payeeRoleName);
              
//              if(this.roleList[j].payeeRoleName==data[i].payeeRoleName)
//              {
//               count++;
//              }
//            }
//            if(count==0)
//            {
//             this.roleList.push(data[i]);
//            }
//            }
//            console.log("token Info",this.empinfo)
//         }
//         if(this.roleList.length<1)
//         {
//           let data={
//             "levelValueCode":"",
//             "levelValueId":"",
//             "levelValueDesc":""
//           }
//           this.roleList.push(data);
//           if(this.empinfo.roleId=="47" || this.empinfo.roleId=="48" ||this.empinfo.roleId=="49")
//           {
//             this.router.navigate(['processrole'])
//           }else
//           {
//             let data=
//             {
//               "msg":"you don't have any role in this system.",
              
//             }
//             this.dialog.open(RoleDialogComponent,{  width: '30%', data: {message: data },  disableClose: false})
            
//             // alert("you don't have any role in this system.")
//           }
          
         
//         }
//         }

//       }
   
//     // this.userDetails=this.config.getUserDetails();
    
   
//     this.roleList=res.data;
   
// console.log("this.roleList",this.roleList);
// //this.userDetails=this.config.getUserDetails();
//     console.log("userDetails",this.userDetails);
    
//     this.config.storeUserDetails(this.userDetails)
//   if(this.roleList.length==1)
//   {
//     this.userDetails['role']=this.roleList[0].payeeRoleName;
//     this.userDetails['roleid']=this.roleList[0].payeeRoleId;   
//     this.userDetails['officeid']=this.roleList[0].levelValueId;
//     this.userDetails['treasCode']=this.roleList[0].treasCode;
//     this.userDetails['treasName']=this.roleList[0].treasName;
//     this.userDetails['assignmentid']=this.empinfo.aid;
//     this.selectedrole = this.roleList[0].payeeRoleName;
   
//     this.config.storeUserDetails(this.userDetails)
//    //window.location.reload();
//   }else{
//     this.selectedrole=this.userDetails.role;
//     console.log("this.selectedrole",this.selectedrole);
    
//   }  
//       }
//     )
//   }
//   redirectToDashboard(j: any) {
//    // alert("Hi");
//     console.log("sss", j);
//     //this.userDetails = this.config.getUserDetails();
//       console.log("role",this.userDetails)
//     this.userDetails['role'] = this.roleList[j].payeeRoleName;
//     this.userDetails['roleid'] = this.roleList[j].payeeRoleId;
//     this.userDetails['officeid']=this.roleList[j].levelValueId;
//     this.userDetails['treasCode']=this.roleList[j].treasCode;
//     this.userDetails['treasName']=this.roleList[j].treasName;
//     this.userDetails['assignmentid'] = this.roleList[j].assignmentId;
//     this.config.storeUserDetails(this.userDetails);
//     console.log("userDetails", this.userDetails);   
//     console.log(this.roleList[j].payeeRoleId);
//     this.selectedrole =this.roleList[j].payeeRoleName;
     
//     window.location.reload();
//     //this.router.navigate(['pension/Inbox']);

//   }
//   getDecodedAccessToken(makerToken: string): any {

//     try {
//       let mytoken = jwt_decode(makerToken);
      
//       this.config.storeDetails('userInfo', JSON.stringify(mytoken))
//       this.empinfo=this.tokenInfo.empinfoService;
      
//     }
//     catch (Error) {
//       return null;
//     }
//   }



  // fetchServicesdetail() {
  //   let data = {
  //       "userAssignmentDtlsId":+this.empinfo.aid
  //   }
  //   this._Service.postRequestpension(data, 'getAdditionalEmployeeDetails').subscribe({
  //     next: (res:any) => {
  //       if ((res.status = 200)) {
  //         this.userEmp_Details = res.data;
  //         // localStorage.setItem('treasury_name',res.data.TREAS_NAME_EN?res.data.TREAS_NAME_EN:"");
  //         this.config.storeDetails('treasury_name',res.data.TREAS_NAME_EN?res.data.TREAS_NAME_EN:"");
  //       }
  //     },
  //     error: (err) => {
        
  //     }
  //   });
  // }

  
}
