import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-life-other-certificates',
  templateUrl: './life-other-certificates.component.html',
  styleUrls: ['./life-other-certificates.component.scss']
})
export class LifeOtherCertificatesComponent implements OnInit {
  imageUrl: any = "assets/images/userImg.png";
  editFile: boolean = true;
  removeUpload: boolean = false;
  constructor(private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
  }

  uploadFile(event: any) {

    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;

        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

}
