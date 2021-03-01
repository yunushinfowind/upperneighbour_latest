import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineVideoService } from '../routine-video.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms'
import { RoutineService } from '../../routine/routine.service';
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
    video_url: '',
    video_type: ''

  }
  imageSrc: any;
  showLoader: boolean = false;
  isValidationForVideo: boolean = false;
  isValidationForEmbedUrl: boolean = false;
  artistList: any;
  user_id: any;
  routine_id: any;
  productForm: FormGroup;
  submitted = false;
  videos: any = [];
  thumbs: any = [];
  sizeSum: any = 0;
  BASEURL: any;
  buttonDisabled :boolean = false;
  checkVideo :boolean=false;
  formLength :any;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private routineService: RoutineVideoService, private router: Router, private routineSer: RoutineService) {
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
    console.log(this.user_id);
    this.getTeacherList()
    this.getRoutineDetail(this.routine_id);
  }

  quantities(): FormArray {
    return this.productForm.get("quantities") as FormArray
  }


  newQuantity(): FormGroup {
    return this.fb.group({
      video_title: ['', Validators.required],
      video_description: ['', [Validators.required]],
      video_type: ['', [Validators.required]],
      /*video: [
            '', 
            [this.conditionalValidator(
              (() => this.isValidationForVideo === false),
              Validators.required
            )]
          ],
      video_url:[
            '', 
            [this.conditionalValidator(
              (() => this.isValidationForEmbedUrl === false),
              Validators.required
            )]
          ],
      thumb:[
            '', 
            [this.conditionalValidator(
              (() => this.isValidationForEmbedUrl === false),
              Validators.required
            )]
          ] */


      video_url: [""],
      thumb: [""],
      video: [""],
    })
  }

  /* conditionalValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (! condition()) {
       return "";
      }else{
         return validator(control);
      }
     }
  }*/

  addQuantity() {
    this.quantities().push(this.newQuantity());
    var form_num = this.quantities().controls.length-1;
    this.formLength = form_num;
    setTimeout(function(){
      $('.video_type_'+form_num).trigger('click');
    },500);
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }



  getTeacherList() {
    this.routineService.allArtistList().subscribe(result => {
      if (result.success) {
        this.artistList = result.data;
      } else {
        this.toastr.error(result.message)
      }
    },
      error => {

      }
    )
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

  getRoutineDetail(id) {
    this.routineSer.routineDetail(id).subscribe(result => {
      if (result.success) {
        this.model.routine_name = result.data.routine_name;
      }
    })
  }

  onFileChange(event, i) {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var type = file.name.split('?')[0].split('.').pop();
      var re = /(\.mp4|\.MOV)$/i;
      if (!re.exec(file.name)) {
        this.toastr.error('Sorry , Please upload mp4/MOV video file');
        $('#video_'+i).val('');
        this.buttonDisabled = true;
        
        return
      }
      else {
        
        this.checkVideo = false;
        for(let j=0;j< this.formLength;j++){
          if($('#video_'+j).is(':checked') && !$('#video_'+j).val()){
            this.checkVideo = true;
          }
        }

        if(this.checkVideo){
          this.buttonDisabled = true;
        }else{
          this.buttonDisabled = false;
        }

        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          var size = event.target.files[0].size / 1000 / 1000;
          size = Math.round(size * 10) / 10
          this.sizeSum = this.sizeSum + size;
          console.log('size:' + this.sizeSum)
          let data = {
            index: i,
            file: file
          }
          this.videos[i] = file;
          if (this.sizeSum > 200) {
            this.toastr.error('Sorry , size of video has been exceeded from 200 MB.')
          }
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
      this.sizeSum = this.sizeSum + size;
      let data = {
        index: i,
        file: file
      }
      this.videos[i] = file;
    }
  }

  onGetUserId(userId) {
    this.model.user_id = userId;
  }

  onSubmit() {
    //alert("aaa");
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
      console.log(this.productForm.invalid);
      if (!this.productForm.invalid && (this.sizeSum < 200)) {
        $('#remove_field_button').prop('disabled', true);
        $('#add_field_button').prop('disabled', true);
        $('#loader_submit').show();
        $('#submit_button').attr('disabled', 'true');
        this.routineService.addRoutineVideo(formData).subscribe(result => {
          if (result.success) {
            this.showLoader = false;
            this.toastr.success(result.message);
            $('#loader_submit').hide();
            $('#submit_button').attr('disabled', 'false');
            // this.router.navigate(['/admin/routine-video/list', this.routine_id, this.user_id]);
            // window.location.href = this.BASEURL + "/admin/routine-video/list/" + this.routine_id + '/' + this.user_id
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

