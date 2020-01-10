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
  private barChartData: ChartDataSets[] = [];

  private barChartLabels: Label[] = ['Odpowiedzi'];
  private setBarChartData() {
    if(this.question.type === 'rate') {
      var average = this.computeAverage();
      this.barChartData = [{data:[average],label:"Średnia"}];
      var maxRate = parseInt(this.question.answers[0]);
      var minRate = parseInt(this.question.answers[this.question.answers.length-1]);
      
      if(this.detectMobile()) {
      this.chartOptions.scales = {
        yAxes: [{
          ticks: {
            min: minRate,
            max: maxRate,
            maxTicksLimit: 3
          }
        }]
      };
    } else {
      this.chartOptions.scales = {
        yAxes: [{
          ticks: {
            min: minRate,
            max: maxRate,
            stepSize: Math.round((maxRate-minRate)/this.question.answers.length)
          }
        }]
      };
    }

    } else {
      this.barChartData = [];
      for (let i = 0; i < this.question.answers.length; i++) {
        var data = {data:[this.question.numberOfVotes[i]], label: this.question.answers[i]};
        this.barChartData.push(data);
      }
    }
  }

  private computeAverage() {
    var sum = 0;
    var votes = 0;
    for(let i = 0; i < this.question.answers.length; i++) {

      sum += parseInt(this.question.answers[i]) * this.question.numberOfVotes[i];
      votes += this.question.numberOfVotes[i];
    }
    if(votes === 0) {
      return 0;
    } else {
      return sum / votes;
    }
  }

  private computeNumberOfVoters() {
    var votes = 0;
    for(let i = 0; i < this.question.answers.length; i++) {
      votes += this.question.numberOfVotes[i];
    }
    return votes;
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
    if(this.question.type === 'rate') {
      this.chartType = "bar";
    }
    this.chartData[0].data = this.question.numberOfVotes;
    this.chartLabels = this.question.answers;
    this.setBarChartData();
  }

  private updateChart() {
    // scaling from zero
    if (this.chartType === 'bar' || this.chartType === 'line') {
      if(this.detectMobile()) {
        this.chartOptions.scales = {
          yAxes: [{
            ticks: {
              min: 0,
              maxTicksLimit: 3
            }
          }]
        };
      } else {
        this.chartOptions.scales = {
          yAxes: [{
            ticks: {
              min: 0
            }
          }]
        };
      }

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

  private detectMobile() {
    if(window.innerWidth <= 800 && window.innerHeight <= 600) {
      return true;
    } else {
      return false;
    }
 }
  ngOnChanges(changes: SimpleChanges) {
    this.updateChart();
  }

}
