import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SeriesVideoService } from '../series-video.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {

 
  public model = {
    video_title: '',
    video_description: '',
    routine_level: '',
    user_id: '',
    video: '',
    thumb: '',
    embed_url:'',
    video_type:'',
    content_type:''
  }
  imageSrc: any;
  showLoader: boolean = false;
  artistList: any;
  video_id: any;
  user_id:any;
  series_id:any;
  BASEURL:any;

  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService, private seriesVideoService: SeriesVideoService, private router: Router) {
    this.BASEURL = environment.BASEURL;
   }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.video_id = params['video_id'];
      this.user_id = params['user_id'];
    })
    this.getRoutineDetail(this.video_id);
    this.getTeacherList()
  }

  getRoutineDetail(id) {
    this.seriesVideoService.seriesVideoDetail(id).subscribe(result => {
      if (result.success) {
        this.model.video_title = result.data.video_title;
        this.model.video_description = result.data.video_description;
        this.model.embed_url = result.data.video_file_name;
        this.model.video_type = result.data.video_type;
        this.model.user_id = result.data.user_id;
        this.imageSrc = result.data.video_thumb;
        this.series_id = result.data.series_id;
        this.model.content_type = result.data.content_type;
      }
    })
  }

  getTeacherList() {

    this.seriesVideoService.allArtistList().subscribe(result => {
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

  routineSubmit(f: NgForm) {

    if (f.valid) {
      this.showLoader = true;
      const formData = new FormData();
      formData.append('video_title', this.model.video_title);
      formData.append('video_description', this.model.video_description);
      // formData.append('routine_level', this.model.routine_level);
      // formData.append('user_id', this.user_id);
      formData.append('embed_url', this.model.embed_url);
      formData.append('video_type', this.model.video_type);
      formData.append('video', this.model.video);
      formData.append('thumb', this.model.thumb);
      formData.append('id', this.video_id);
      formData.append('content_type', this.model.content_type);
      
      this.seriesVideoService.editRoutineVideo(formData).subscribe(result => {
        if (result.success) {
          this.showLoader = false;
          this.toastr.success(result.message);
          // this.router.navigate(['/admin/routine-video/list',this.routine_id , this.user_id])
          window.location.href = this.BASEURL+"/admin/series-video/list/"+this.series_id+'/'+this.user_id
        } else {
          this.toastr.error(result.message)
        }
      },
        error => {

        }
      )
    }

  }

  handleClick(e) {
    console.log(e)
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.model.video = file;
    }
  }

  onThumbFileChange(event) {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.model.thumb = file;
    }
  }

  onGetUserId(userId) {
    this.model.user_id = userId;
  }

}
