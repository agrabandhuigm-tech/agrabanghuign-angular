import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: "root"
})
export class RedirectService {
  constructor(
    @Inject(DOCUMENT)
    private document: Document,private service:ApiService
  ) {}

  public postRedirect(params: any) {

    const form = this.document.createElement("form");
    console.log('....params',params);
    form.method = "POST";
    form.target = "_top";
    form.action = environment.esignUrlNew;
    form.enctype="multipart/form-data";
    const input = this.document.createElement("input");
      input.type = "hidden";
      input.name = "msg";
      input.value = params;
      console.log("input",input.name);
      form.append(input);



    this.document.body.appendChild(form);
    form.submit();
  }
}
