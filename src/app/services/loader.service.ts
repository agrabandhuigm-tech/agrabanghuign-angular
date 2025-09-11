import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

 
@Injectable({
  providedIn: 'root'
})
export class LoaderService  {
  
  isLoading = new Subject<boolean>();

  constructor() {
  }
  ngOnDestroy(): void {
    
  }
  ngOnInit(): void {
  
  }

  show() {
     this.isLoading.next(true);
  }

  hide() {
       this.isLoading.next(false);
  }
}