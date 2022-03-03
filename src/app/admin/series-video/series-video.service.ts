import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeriesVideoService {

  
  baseUrl: string = "";
  constructor(private router: Router, private httpclient: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  addSeriesVideo(blogForm: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const result = this.httpclient.post(this.baseUrl + '/admin/add-series-video', blogForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  createVideoSliceRecordong(sliceForm){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const result = this.httpclient.post(this.baseUrl + '/admin/create-slice-recording', sliceForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  addNotation(notationForm){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const result = this.httpclient.post(this.baseUrl + '/admin/create-notation', notationForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }
  seriesVideoList(page,seriesId,search) {
    const result = this.httpclient.get(this.baseUrl + '/user/admin-series-video-list' + '?page=' + page + '&series_id=' + seriesId + '&search=' + search
    );
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  allArtistList() {
    const result = this.httpclient.get(this.baseUrl + '/admin/artist-list');
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  seriesVideoDetail(id: any) {
    const result = this.httpclient.get(this.baseUrl + '/admin/series-video/' + id
    );
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  editRoutineVideo(videoForm: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const result = this.httpclient.post(this.baseUrl + '/admin/edit-series-video', videoForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  deleteSeriesVideo(id: any) {
    const result = this.httpclient.delete(this.baseUrl + '/admin/delete-series-video/' + id);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  getCurrentDragList(page,series_id , model) {
    const result = this.httpclient.get(this.baseUrl + '/admin/common-list' + '?page=' + page+'&model='+model+'&series_id='+series_id
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
