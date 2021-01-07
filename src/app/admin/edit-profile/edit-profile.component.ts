import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountServiceService } from '../account-service.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  public model = {
    fullname: '',
    email: '',
    profile: ''
   
  }
  showLoader:boolean=false;
  adminDetail:any;
  imageSrc:any;

  constructor(private router: Router,private accountService: AccountServiceService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getAdminDetail();
  }

  getAdminDetail() {
    this.accountService.getAdminDetail().subscribe(result => {
    console.log(result.data.profile);
      if (result.success) {
        this.adminDetail = result.data;
        this.model.fullname = result.data.fullname;
        this.model.email = result.data.email;
        this.imageSrc = result.data.profile
        
     }
    })
  }

  adminSubmit(f: NgForm) {
    if (f.valid) {
      this.showLoader = true;
      const formData = new FormData();
      formData.append('profile', this.model.profile);
      formData.append('fullname', this.model.fullname);
      formData.append('id', this.adminDetail.id);
      this.accountService.updateAdminProfile(formData).subscribe(result => {
        if (result.success) {
          console.log(result.data)
          this.showLoader = false;
          this.toastr.success(result.message);
          $('#admin_profile').attr('src', result.data.profile);
          $('#admin_name').text(result.data.fullname);
          // this.router.navigateByUrl('/admin/user/list')
        } else {
          this.toastr.error(result.message)
        }
      },
      error => {

      }
      )
    }

  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.model.profile = file;
    }
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }

}
