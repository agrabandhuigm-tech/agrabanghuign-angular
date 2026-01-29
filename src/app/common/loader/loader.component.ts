import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  standalone: false
})
export class LoaderComponent implements OnInit {
  // isLoading:boolean=true;

  isLoading: Subject<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading;
    console.log("loading", this.loaderService.isLoading);

  }

  ngOnInit(): void {

  }

}
