import { Component, OnInit } from '@angular/core';
// import { UsersService } from '../../../services/users.service'
import { Menu, SubMenuActionMaster } from 'src/app/model/user';
import { ActivatedRoute, Router } from '@angular/router';
// import { APIResponse } from 'src/app/model/apiResponse';
import { MatDialog } from '@angular/material/dialog';
// import { inputtransHelperService } from 'src/app/services/helper/inputtransHelper.Service';
// import { ErrorValideteComponent } from 'src/app/layouts/ValidationModal/error-validate.component';
import { AppConfig } from 'src/app/app.config';
import { NgForm } from '@angular/forms';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { VendorSubmitDialogComponent } from 'src/app/shared/vendor-submit-dialog/vendor-submit-dialog.component';
import { MenuComponent } from '../menu/menu.component';
@Component({
  selector: 'menucreate',
  templateUrl: './menu-create.component.html'
})

export class MenuCreateComponent implements OnInit {
  parentmenu:any;
  roleList:any;
  Model: Menu = new Menu();
  MenuList: any;
  entsubmenuaction: Array<SubMenuActionMaster> | [];
  currentUser: any;
  TokenNumber: any;
  URMId: any;
  UserName: any;
  SSOId: any;
  UserId: any;
  EmailId: any;
  RoleId: any;
  DepartmentId: any;
  OfficeId: any;
  editMode:any;
  menuId:any;
  message: any = '';
  
config: AppConfig = new AppConfig();
  constructor(public dialog: MatDialog, 
    private router: Router,
    public apiurl:ApiUrlService,
    public apiService: ApiService,
    public api:ApiService,
    private actRoute: ActivatedRoute) {

     let subaction: any = JSON.parse('[{"ID":1,"NAME":"Create","ISCHECKED":false},{"ID":2,"NAME":"Edit","ISCHECKED":false},{"ID":3,"NAME":"Delete","ISCHECKED":false},{"ID":4,"NAME":"Detail","ISCHECKED":false},{"ID":5,"NAME":"Approval","ISCHECKED":false}]');
     this.entsubmenuaction = subaction;
     this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      this.editMode = params['edit'];
  this.menuId=params['menuId'];
  console.log(this.menuId);
  
    });
     this.getMenu();
    
     if(this.editMode=='edit')
     {
      this.fillInfo();
     }
  }
  ngOnInit(): void {
    // $(".preloader-it").fadeIn("slow");
    
    this.bindSessiondata(); 
    // this.userManagement.getMenuParent().subscribe(objectList => {
      this.MenuList = [];
    // })
    this.getMenuActions();
    // $(".preloader-it").fadeOut("slow");
  }
  bindSessiondata() {

    // if (localStorage.getItem('currentUser')) {
    //   const userinfo = localStorage.getItem('currentUser');
    //   const decryptuserinfo: any = this.config.decrypt(userinfo);
    //   this.currentUser = JSON.parse(decryptuserinfo);
    //   this.TokenNumber = this.currentUser.TokenNumber;
    //   this.URMId = this.currentUser.URMId;
    //   this.UserName = this.currentUser.UserName;;
    //   this.SSOId = this.currentUser.SSOId;
    //   this.UserId = this.currentUser.UserId;
    //   this.EmailId = this.currentUser.EmailId;
    //   this.RoleId = this.currentUser.RoleId;
    //   this.DepartmentId = this.currentUser.DepartmentId;
    //   this.OfficeId = this.currentUser.OfficeId;
    // }
    // else {
    //   this.router.navigate(['../dashboard'])
    // }
  }


  getMenuActions() {
    // this.userManagement.getMenuAction().subscribe((res: APIResponse<SubMenuActionMaster[]>) => {
    //   if (res.IsSuccess) {
    //     this.entsubmenuaction = res.Data;
    //     console.log(res.Data);
    //   }
    // });
  }

  onClearForm() {
    this.Model.nameEn = '';
    this.Model.nameHi = '';
    this.Model.navigateUrl = '';
    this.Model.MenuIcon = '';
    this.Model.parentId = 0;
    this.Model.orderNo = 0;
    this.Model.isActive = false;
  }

  Allowletterswhitespacesonly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && (charCode != 32 && charCode != 0)) {

      return false;
    }
    return true;
  }
  ngAfterViewInit() {
    // this.inputtransHelper.converAllControl(this);
  }

  getMenu()
  {
    var url=this.apiurl.url.getMstMenu;    
    var data={               
    };
   // alert(parentId)
    this.api.post(url,data).subscribe((res: any) => {
      
      console.log("get mst menu",res);
      if(res.status=='SUCCESS')
      {
     this.roleList= res.data;
    
  console.log("this.roleList",this.roleList);  
      }
    })
  }


  fillInfo(){
    var url=this.apiurl.url.getEditMenuMaster;    
    var data={  
      "menuId": this.menuId
    };
    //console.log(data,menuId)
    this.api.post(url,data).subscribe((res: any) => {
      
      console.log("filldata",res);
      if(res.status=='SUCCESS')
      {
        let menuDetail = res.data[0];
        console.log('......',menuDetail);
        console.log("this.roleList",this.roleList);  
        this.Model.nameEn = menuDetail.menuNameEn;
        this.Model.nameHi = menuDetail.menuNameHI;
        this.Model.parentId = menuDetail.parentId;
        this.Model.navigateUrl = menuDetail.navigateUrl;
        this.Model.isActive = menuDetail.isActive == 1 ? true : false;
        this.Model.menuId = menuDetail.menuId;
        this.Model.orderNo = menuDetail.orderNo;
        
      }
    })
  }

  changeStatus(){

    var data={} 
    var url=this.apiurl.url.changemenustatus;  
    this.api.post(url,data).subscribe((res: any) => {
      if(res.status=='SUCCESS')
      {
      }
    })

   }



  onSubmit(f: NgForm) {
     console.log(f.value)
     let data =  f.value;

     data['isActive'] = f.value.isActive == true ? 1 : 0;

     if(this.editMode == 'edit'){
       data['menuId'] = this.menuId;
       var url=this.apiurl.url.updateMstMenu;   
       this.message = 'Menu updated successfully'; 
     }else{
       data['menuId'] = 0;
       var url=this.apiurl.url.getallsubmitmenu;
       console.log(url)
       this.message = 'Menu added successfully';    
     }
     var JsonData: any ={};    
 
     this.api.post(url,data).subscribe((res: any) => {
       
       console.log("update result",res);
       if(res.status=='SUCCESS')
       {
         console.log(res)
         this.dialog.open(VendorSubmitDialogComponent,{ panelClass: 'dialog-w-30', data: {message: this.message, redirectionPath: 'admin/menu'},  disableClose: true});
       }else{
         this.dialog.open(VendorSubmitDialogComponent,{ panelClass: 'dialog-w-30', data: {message: "Some Error Occured", redirectionPath: 'admin/menu-create'},  disableClose: true});
       }
     })
   }

}