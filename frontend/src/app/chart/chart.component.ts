import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {Question} from '../question';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() question: Question;
  @Input() chartTrigger: number;

  public chartType: ChartType = 'pie';
  private chartOptions: ChartOptions = {

    responsive: true,
    legend: {
      reverse: true,
    },
    title: {
      display: true
    }
  };
  private chartLegend = true;
  private chartPlugins = [];
  private chartData: ChartDataSets[] = [
    { data: []},
    ];

  private chartLabels: Label[] = [];


  public changeType = () => {
    const types: ChartType[] = ['pie', 'doughnut', 'bar', 'line'];
    const i = types.indexOf(this.chartType);
    this.chartType = types[(i + 1) % types.length];
  }

  constructor() { }

  ngOnInit() {
    this.chartData[0].label = this.question.question;
    this.chartOptions.title.text = this.question.question;
    this.chartLabels = this.question.answers;
    this.chartData[0].data = this.question.numberOfVotes;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.chartData[0].data = this.question.numberOfVotes;
  }

}
