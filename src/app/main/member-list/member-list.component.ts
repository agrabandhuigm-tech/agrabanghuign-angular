import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

export interface Member {
  name: string;
  address: string;
  occupation: string;
  mobile: string;
}

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent {

  members: Member[] = [];
  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.getList();
  }
  getList() {
    this.apiService.post("members", { "requestJson": { "inType": 2 } }).subscribe((res: any) => {

      if (JSON.stringify(res).includes("id")) {
        let jsondata = JSON.parse(res?.data[0]?.members_json);
        console.log("jsondata", jsondata);
        this.members = jsondata;
      }
    })
  }
}
