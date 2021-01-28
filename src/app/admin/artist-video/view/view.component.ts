import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ArtistVideoService } from '../artist-video.service';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  Id: any;
  routineVideoDetail: any;
  model = {
    video_thumb:'',
    routine_name : '',
    video_url : ''
  }
  video_link : any
  local_video :boolean = false;
  embed_video:boolean = false;

  constructor(private dom:DomSanitizer , private artistVideoService: ArtistVideoService, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.params.subscribe(params => {
      this.Id = params['video_id'];
      this.getDetail(this.Id);
    })
  }

  ngOnInit(): void {
      
  }

  getDetail(id) {
    this.artistVideoService.artistVideoDetail(id).subscribe(result => {
      if (result.success) {
        this.routineVideoDetail = result.data;
        this.model.video_thumb = result.data.video_thumb;
        this.model.video_url = result.data.video_link;
        this.video_link = this.dom.bypassSecurityTrustResourceUrl(result.data.video_link);
        if(result.data.video_type == 'video'){
          this.local_video = true;
        }else{
          this.embed_video = true;
        }
       
      }
    })
  }

}

