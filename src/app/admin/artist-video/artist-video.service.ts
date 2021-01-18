import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtistVideoService {

  baseUrl: string = "";
  constructor(private router: Router, private httpclient: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  addArtistVideo(blogForm: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const result = this.httpclient.post(this.baseUrl + '/admin/add-artist-video', blogForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }
  
  createVideoSliceRecordong(sliceForm){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const result = this.httpclient.post(this.baseUrl + '/admin/create-artist-video-slice-recording', sliceForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  addNotation(notationForm){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const result = this.httpclient.post(this.baseUrl + '/admin/create-artist-video-notation', notationForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  artistVideoList(page,artistId,search) {
    const result = this.httpclient.get(this.baseUrl + '/admin/artist-video-list' + '?page=' + page + '&user_id=' + artistId + '&search=' + search
    );
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  artistVideoDetail(id: any) {
    const result = this.httpclient.get(this.baseUrl + '/admin/artist-video/' + id
    );
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  editArtistVideo(videoForm: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const result = this.httpclient.post(this.baseUrl + '/admin/edit-artist-video', videoForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  deleteArtistVideo(id: any) {
    const result = this.httpclient.delete(this.baseUrl + '/admin/delete-artist-video/' + id);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  getCurrentDragList(page,user_id , model) {
    const result = this.httpclient.get(this.baseUrl + '/admin/common-list' + '?page=' + page+'&model='+model+'&user_id='+user_id
    );
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  updateOrder(orderUpdateForm: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const result = this.httpclient.post(this.baseUrl + '/admin/update-order-list', orderUpdateForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }
  
}
