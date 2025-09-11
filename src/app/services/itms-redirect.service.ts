import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ItmsRedirectService {

  constructor(private apiService: ApiService) { }

  itmsRedirectPost(paramsValue: any = [], data: any = {}) {
    let authToken = sessionStorage.getItem('authToken');
    const authTokenVal = authToken ? authToken : '';
    let params = [{
      key: 'userdetails',
      value: authTokenVal
    }];
    paramsValue.forEach((el: any) => {
      params.push({
        key: el.key,
        value: el.value,
      });
    });
    console.log('ritms params:', params)
    this.apiService.postITMS('itms/externalRedirect', data).subscribe({
      next: (res) => {
        const response = res.data;
        this.formSubmit(response.url, params);
      },
      error: (res) => {
      }
    });
  }

  formSubmit(url: string, params: any) {
    // console.log('ritms params:', params)
    let formParams: any;
    var form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.target = "_blank"
    form.style.display = 'none';
    params.forEach((el: any) => {
      formParams = document.createElement("input");
      formParams.name = el.key;
      formParams.value = el.value;
      form.appendChild(formParams);
    });
    document.body.appendChild(form);
    form.submit();
  }

}
