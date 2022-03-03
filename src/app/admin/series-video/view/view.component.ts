import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SeriesVideoService } from '../series-video.service';




@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})


export class ViewComponent implements OnInit {

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  Id: any;
  seriesVideoDetail: any;
  model = {
    video_thumb: '',
    series_name: '',
    video_url: ''
  }
  video_link: any
  video_link_url: any;
  local_video :boolean = false;
  embed_video:boolean = false;

  constructor(private dom: DomSanitizer, private seriesVideoService: SeriesVideoService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.Id = params['video_id'];
      this.getRoutineDetail(this.Id);
    })

    this.video_link_url =
      console.log(this.video_link);

  }

  ngOnInit(): void {


  }

  getRoutineDetail(id) {
    this.seriesVideoService.seriesVideoDetail(id).subscribe(result => {
      if (result.success) {
        this.seriesVideoDetail = result.data;
        this.model.video_thumb = result.data.video_thumb;
        this.model.video_url = result.data.video_link;
        this.model.series_name = result.data.series.series_name
        this.video_link = this.dom.bypassSecurityTrustResourceUrl(result.data.video_link);
        if(result.data.video_type == 'video'){
          this.local_video = true;
        }else{
          this.embed_video = true;
        }
      }
    })
  }

  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

}
