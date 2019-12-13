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
    },
  };
  private chartLegend = true;
  private chartPlugins = [];
  private chartData: ChartDataSets[] = [
    { data: []},
    ];

  private chartLabels: Label[] = [];

  // bar chart needs data in another format to work as I wanted
  private barChartData: ChartDataSets[] = [
    { data: [0], label: '' },
    { data: [0], label: '' }
  ];

  private barChartLabels: Label[] = ['Odpowiedzi'];
  private setBarChartData() {
    for (let i = 0; i < this.question.answers.length; i++) {
      this.barChartData[i].data = [this.question.numberOfVotes[i]];
      this.barChartData[i].label = this.question.answers[i];
    }
  }

  private changeType = () => {
    const types: ChartType[] = ['pie', 'doughnut', 'bar', 'line'];
    const i = types.indexOf(this.chartType);
    this.chartType = types[(i + 1) % types.length];
    this.updateChart();
  }

  constructor() { }

  ngOnInit() {
    this.chartData[0].label = this.question.question;
    this.chartOptions.title.text = this.question.question;
    this.chartLabels = this.question.answers;
    this.chartData[0].data = this.question.numberOfVotes;
    this.setBarChartData();
  }

  private updateChart() {
    // scaling from zero
    if (this.chartType === 'bar' || this.chartType === 'line') {
      this.chartOptions.scales = {
        yAxes: [{
          ticks: {
            min: 0
          }
        }]
      };
    } else {
      this.chartOptions.scales = {};
    }
    // different datatype for bar chart,
    if (this.chartType === 'bar') {
      this.setBarChartData();
      this.chartOptions.legend.reverse = false;
    } else {
      this.chartData[0].data = this.question.numberOfVotes;
      this.chartOptions.legend.reverse = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateChart();
  }

}
