import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeriesServiceService } from '../series-service.service';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  Id: any;
  routineDetail: any;

  constructor(private seriesService: SeriesServiceService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.Id = params['id'];
    })
    this.getRoutineDetail(this.Id);
  }
  getRoutineDetail(id) {
    this.seriesService.routineDetail(id).subscribe(result => {
      if (result.success) {
        this.routineDetail = result.data;
        console.log(this.routineDetail)
      }
    })
  }

}
