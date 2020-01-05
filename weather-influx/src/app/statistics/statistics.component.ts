import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: 'My title'
    },
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };

  startDate = new Date(2019, 11, 24); // 24 Dec telegraf started 13:00
  
  constructor() { console.log(this.startDate); }

  ngOnInit() {
  }

}
