import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms'
import { ArtistVideoService } from '../artist-video.service';
import { TeacherService } from '../../teacher/teacher.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  name = 'Angular';
  public model = {
    routine_name: '',
    routine_description: '',
    routine_level: '',
    user_id: '',
    video: '',
    artist_name: '',
    video_url: '',
    video_type: ''
  }
  imageSrc: any;
  showLoader: boolean = false;
  artistList: any;
  user_id: any;
  routine_id: any;

  productForm: FormGroup;
  submitted = false;
  videos: any = [];
  thumbs: any = [];
  BASEURL:any;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private artistVideoService: ArtistVideoService, private router: Router, private teacherService: TeacherService) {
    this.BASEURL = environment.BASEURL;
    this.productForm = this.fb.group({
      name: '',
      quantities: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.user_id = params['user_id'];
      this.routine_id = params['routine_id'];
    })
    this.getTeacherDetail(this.user_id);
    console.log(this.user_id);

  }
  ngAfterViewInit() {
    // $('.video_check_inbox').trigger('click');
    // assume dynamic HTML was added before
  }

  quantities(): FormArray {
    return this.productForm.get("quantities") as FormArray
  }


  newQuantity(): FormGroup {
    return this.fb.group({
      video_title: ['', Validators.required],
      video_description: ['', [Validators.required]],
      video_type: ['', [Validators.required]],
      //video: ['', [Validators.required]],
      video_url: [""],
      thumb: [""],
      video: [""],
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
    // $('.video_check_inbox').trigger('click');
  }

  checkVideoRadioInput() {
    // $('.video_check_inbox').trigger('click');
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }



  handleClick(e) {
    console.log(e)
  }

  onTypeChange(event, i) {
    if (event.target.value == "video") {

      this.productForm.controls.quantities['controls'][i].get('video').setValidators(Validators.required)
      this.productForm.controls.quantities['controls'][i].get('video').updateValueAndValidity()

      this.productForm.controls.quantities['controls'][i].get('video_url').clearValidators();
      this.productForm.controls.quantities['controls'][i].get('video_url').updateValueAndValidity()

      this.productForm.controls.quantities['controls'][i].get('thumb').clearValidators();
      this.productForm.controls.quantities['controls'][i].get('thumb').updateValueAndValidity()
      $("#embed_url_div_" + i + "").hide();
      $("#video_div_" + i + "").show();

    }
    if (event.target.value == "embed_url") {
      this.productForm.controls.quantities['controls'][i].get('video').clearValidators();
      this.productForm.controls.quantities['controls'][i].get('video').updateValueAndValidity()

      this.productForm.controls.quantities['controls'][i].get('video_url').setValidators(Validators.required)
      this.productForm.controls.quantities['controls'][i].get('video_url').updateValueAndValidity()

      this.productForm.controls.quantities['controls'][i].get('thumb').setValidators(Validators.required)
      this.productForm.controls.quantities['controls'][i].get('thumb').updateValueAndValidity()

      $("#video_div_" + i + "").hide();
      $("#embed_url_div_" + i + "").show();
    }
  }


  getTeacherDetail(id) {
    this.teacherService.teacherDetail(id).subscribe(result => {
      if (result.success) {
        this.model.artist_name = result.data.fullname;
      }
    })
  }

  checkVideoType() {
    if (!$('#video_type').is(':checked') && !$('#embed_url').is(':checked')) {
      this.toastr.error('Please select video type first.');
      return
    }
  }

  onFileChange(event, i) {

    if (!$('#video_type').is(':checked') && !$('#embed_url').is(':checked')) {
      this.toastr.error('Please select video type first.');
      return
    }
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var type = file.name.split('?')[0].split('.').pop();
      var re = /(\.WMV|\.mp4|\.MOV)$/i;
      if (!re.exec(file.name)) {
        this.toastr.error('Sorry , Please upload video file')
        return
      }
      else {
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          let data = {
            index: i,
            file: file
          }
          this.videos[i] = file;
        }
      }
    }
  }

  onFileThumbChange(event, i) {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var size = event.target.files[0].size / 1000 / 1000;
      size = Math.round(size * 10) / 10
      let data = {
        index: i,
        file: file
      }
      this.videos[i] = file;
      console.log('thumb image:')
      console.log(this.thumbs[i])
    }
  }

  /* onThumbChange(event, i) {
     const reader = new FileReader();
     if (event.target.files.length > 0) {
       const file = event.target.files[0];
       let data = {
         index: i,
         file: file
       }
       this.thumb[i] = file;
     }
   }
 */

  onGetUserId(userId) {
    this.model.user_id = userId;
  }

  onSubmit() {

    this.submitted = true;
    var data = this.productForm.value.quantities;
    var formLength = this.productForm.value.quantities.length;

    if (formLength > 0) {
      var allFormData = [];
      let total_form: FormData[] = [];
      var formData = new FormData();
      for (let i = 0; i < formLength; i++) {
        let postData = {
          "video_title": data[i].video_title,
          "video_description": data[i].video_description,
          "user_id": this.user_id,
          "routine_id": this.routine_id,
          "embed_url": data[i].video_url,
          "video_type": data[i].video_type
        }
        console.log(postData);
        formData.append('data[]', JSON.stringify(postData));
        formData.append('videos[]', this.videos[i]);
        //formData.append('thumb[]', this.thumb[i]);
      }

      if (!this.productForm.invalid) {
        $('#remove_field_button').prop('disabled', true);
        $('#add_field_button').prop('disabled', true);
        $('#loader_submit').show();
        this.artistVideoService.addArtistVideo(formData).subscribe(result => {
          if (result.success) {
            this.showLoader = false;
            this.toastr.success(result.message);
            $('#loader_submit').hide();
            $('#submit_button').attr('disabled', 'false');
            window.location.href = this.BASEURL+"/admin/artist-video/list/"+this.user_id
          } else {
            this.toastr.error(result.message)
          }
        }
        )
      }
    } else {
      this.toastr.error('Please add form')
    }
    console.log(allFormData);
  }

}

