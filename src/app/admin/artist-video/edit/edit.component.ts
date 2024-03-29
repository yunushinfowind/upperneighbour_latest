import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistVideoService } from '../artist-video.service';
import { environment } from '../../../../environments/environment';


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
    video_level:'',
    content_type:''
  }
  imageSrc: any;
  showLoader: boolean = false;
  artistList: any;
  video_id: any;
  user_id:any;
  routine_id:any;
  BASEURL:any;

  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService, private artistVideoService: ArtistVideoService, private router: Router) { 
    this.BASEURL = environment.BASEURL;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.video_id = params['video_id'];
      
    })
    this.getRoutineDetail(this.video_id);
  }

  getRoutineDetail(id) {
    this.artistVideoService.artistVideoDetail(id).subscribe(result => {
      console.log(result);
      if (result.success) {

        this.model.video_title = result.data.video_title;
        this.model.video_description = result.data.video_description;
        this.model.embed_url = result.data.video_file_name;
        this.model.video_type = result.data.video_type;
        this.model.video_level = result.data.video_level;
        this.user_id = result.data.user_id;
        this.imageSrc = result.data.video_thumb;
        this.model.content_type = result.data.content_type;
      }
    })
  }

  routineSubmit(f: NgForm) {

    if (f.valid) {
      this.showLoader = true;
      const formData = new FormData();
      formData.append('video_title', this.model.video_title);
      formData.append('video_description', this.model.video_description);
      formData.append('embed_url', this.model.embed_url);
      formData.append('video_type', this.model.video_type);
      formData.append('video_level', this.model.video_level);
      formData.append('video', this.model.video);
      formData.append('thumb', this.model.thumb);
      formData.append('content_type', this.model.content_type);
      
      formData.append('id', this.video_id);
      this.artistVideoService.editArtistVideo(formData).subscribe(result => {
        if (result.success) {
          this.showLoader = false;
          this.toastr.success(result.message);
          // this.router.navigate(['/admin/routine-video/list',this.routine_id , this.user_id])
          window.location.href = this.BASEURL+"/admin/artist-video/list/"+this.user_id
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
