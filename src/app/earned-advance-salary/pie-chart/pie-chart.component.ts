import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  public chart: any;
  @Input() configChart:any
  
  constructor() { }

  ngOnInit(): void {
    console.log("chart data",this.configChart);
    
    this.createChart();
  }
  createChart() {

    this.chart = new Chart("MyChart", this.configChart);
  }

}
