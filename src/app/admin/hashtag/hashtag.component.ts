import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HashtagServiceService } from '../hashtag-service.service';


@Component({
  selector: 'app-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.css']
})
export class HashtagComponent implements OnInit {

  public model = {
    hashtag: '',
    hashtagVideo: ''
  }
  imageSrc: any;
  Id: any;
  hashtagDetail: any;
  showLoader:boolean=false;


  public Editor = ClassicEditor;
  constructor(private toastr: ToastrService, private hashtagService: HashtagServiceService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.Id = params['id'];
    })
    this.getHashtagDetail(this.Id);
  }

  getHashtagDetail(id) {
    this.hashtagService.hashtagDetail(id).subscribe(result => {
    console.log(result.data.hashtagVideo);
      if (result.success) {
        this.hashtagDetail = result.data;
        this.model.hashtag = result.data.hashtag;
        this.imageSrc = result.data.video_thumb
        console.log(this.hashtagDetail)
      }

    })
  }


  hashtagSubmit(f: NgForm) {
 
    if (f.valid) {
      this.showLoader = true;
      const formData = new FormData();
      formData.append('hashtagVideo', this.model.hashtagVideo);
      formData.append('hashtag', this.model.hashtag);
      console.log(formData);
      this.hashtagService.editHashtag(formData).subscribe(result => {
        if (result.success) {
          this.showLoader = false;
          this.toastr.success(result.message);
          this.router.navigateByUrl('/admin/hashtag')
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
      this.model.hashtagVideo = file;
    }
    /*if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }*/
  }

}

