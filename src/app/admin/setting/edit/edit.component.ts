import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from '../setting.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, NgForm } from '@angular/forms'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public model = {
    slice_user_name: '',
    slice_password: '',
    routine_level: '',
    user_id: '',
    video: ''

  }
  List : any;
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private activatedRoute:ActivatedRoute, private toastr: ToastrService, private settingService: SettingService, private router: Router) { 
    this.productForm = this.fb.group({
      name: '',
      quantities: this.fb.array([]),
    });

  }

  ngOnInit(): void {
    this.settingList();
  }

  
  settingList() {
   
    this.settingService.getSettings().subscribe(
      result => {
        if (result.success == true) {
          this.List = result.data;
          this.model.slice_user_name = result.data[0].value;
          this.model.slice_password = result.data[1].value;
          console.log('this.List')
          console.log(this.List)
        }
      },
      error => {

      }
    )
  }

  settingSubmit(f: NgForm){
    if (f.valid) {
      const formData = new FormData();
      formData.append('slice_user_name', this.model.slice_user_name);
      formData.append('slice_password', this.model.slice_password);
      console.log(this.model.slice_user_name)
      var settingData = [
        {
          key : 'slice_user_name',
          value : this.model.slice_user_name
        },
        { key : 'slice_password',
          value : this.model.slice_password
        }
      ]
      formData.append('settings[]', JSON.stringify(settingData));
      this.settingService.updateSetting(formData).subscribe(result => {
        if (result.success) {
          // this.showLoader = false;
          this.toastr.success('Setting updated successfully.');
        } else {
          this.toastr.error(result.message)
        }
      }
      )
      
    }
  }

}
