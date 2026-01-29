
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-upload-biodata',
  templateUrl: './upload-biodata.component.html',
  styleUrls: ['./upload-biodata.component.scss'],
  standalone: false
})
export class UploadBiodataComponent {
  biodataForm: FormGroup;
  profileImage: File | null = null;
  biodataFile: File | null = null;
  profile: string = "assets/images/user.png";


  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    public common: CommonService,
    private router: Router) {
    this.biodataForm = this.fb.group({
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      occupation: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      profileImage: [null, Validators.required],
      biodataPdf: [null, Validators.required],
      passKey: ['', [Validators.required]],
    });
  }

  onProfileImageSelected(event: any) {
    if (event.target.files && event.target.files.length) {
      this.profileImage = event.target.files[0];
      this.biodataForm.patchValue({ profileImage: this.profileImage });
      if (this.profileImage) {
        this.common.fileToBase64(this.profileImage).then(base64 => {
          console.log('Base64:', base64);
          this.base64String.push({ "filename": this.profileImage?.name, "filedata": base64, "type": "image" })
        }).catch(err => console.error(err));
      }
    }
  }

  onBiodataFileSelected(event: any) {
    if (event.target.files && event.target.files.length) {
      this.biodataFile = event.target.files[0];
      this.biodataForm.patchValue({ biodataPdf: this.biodataFile });
      if (this.biodataFile) {
        this.common.fileToBase64(this.biodataFile).then(base64 => {
          console.log('Base64:', base64);
          this.base64String.push({ "filename": this.biodataFile?.name, "filedata": base64, "type": "resume" })
        }).catch(err => console.error(err));
      }
    }
  }
  base64String: any[] = [];
  submit() {
    if (this.biodataForm.invalid) return;

    let submitData = {
      "requestJson": {
        "inType": 1,
        "name": this.biodataForm.value.name,
        "fatherName": this.biodataForm.value.fatherName,
        "age": this.biodataForm.value.age,
        "occupation": this.biodataForm.value.occupation,
        "image": this.profileImage?.name,
        "passKey": this.biodataForm.value.passKey,
        "contact": this.biodataForm.value.contact,
        "biodata": this.biodataFile?.name,
        "files": this.base64String
      }
    }
    console.log("submitData", submitData)
    this.apiService.post("marriageBiodata", submitData).subscribe((res: any) => {
      console.log(res);
      if (res.data[0].message == "Record and files inserted successfully") {
        alert("Biodata Insert Successfully")
        this.router.navigate(['marriage-bio-list'])
      } else {
        alert("Issue in Insert")
      }

    })

  }
}