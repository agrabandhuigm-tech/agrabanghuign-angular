import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading = new Subject<boolean>();
  private requestCount = 0;

  constructor() {
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {

  }

  show() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.isLoading.next(true);
    }
  }

  hide() {
    if (this.requestCount > 0) {
      this.requestCount--;
      if (this.requestCount === 0) {
        this.isLoading.next(false);
      }
    }
  }
}