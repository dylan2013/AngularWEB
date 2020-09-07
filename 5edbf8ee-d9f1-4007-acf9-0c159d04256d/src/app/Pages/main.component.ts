import { GadgetService } from './../service/gadget.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { DSAService, BodyTemperatureRecord } from './../service/dsa.service';
import { PaggingService } from './../service/pagging.service';
import * as Chart from 'Chart.js';
import * as Moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: []
})
export class MainComponent implements OnInit {

  loading: boolean;
  error: any;
  temperature: BodyTemperatureRecord[];
  canvas: any;
  ctx: any;

  //日期
  labelList: string[];
  //體溫
  temperatureList: number[];

  //色碼(點)
  backgroundKey: string[];

  //色碼(線)
  borderKey: string[];

  constructor(
    private gadget: GadgetService,
    private dsa: DSAService,
    private svcPagging : PaggingService) {
  }

  async ngOnInit() {

    //分析與整理一份Chart
    // this.ngAfterViewInit();

    try {
      this.loading = true;

      this.temperature = await this.dsa.getMyTemperature();

      //依日期排序
      this.temperature = this.temperature.sort((n1, n2) => {
        if (n1.OccurDate > n2.OccurDate) {
          return 1;
        }

        if (n1.OccurDate < n2.OccurDate) {
          return -1;
        }

        return 0;
      });



      //繪製Chart時,要在最後階段
      //因此需要將排成放在畫面最後
      setTimeout(() => {
        this.drawChart();
      }, 0);

    } catch (err) {
      this.error = err;
      console.log(err);
    } finally {

      this.loading = false;
    }

  }

  parseLDate(input) {
    return Moment(input).format('YYYY/MM/DD hh:mm');
  }

  parseSDate(input) {
    return Moment(input).format('M/D');
  }

  private drawChart() {

    this.labelList = [];
    this.temperatureList = [];
    this.backgroundKey = [];
    this.borderKey = [];

    this.temperature.forEach(element => {

      //日期
      this.labelList.push(this.parseSDate(element.OccurDate) + "(" + element.Category + ")");
      //體溫
      this.temperatureList.push(element.BodyTemperature);

      if (element.BodyTemperature >= 37.5) {

        //體溫過高
        this.backgroundKey.push("rgba(255, 0, 0, 0.8)");
        this.borderKey.push("rgba(255, 0, 0, 0.8)");

      } else {

        //體溫正常
        this.backgroundKey.push("rgba(75, 192, 192, 0.8)");
        this.borderKey.push("rgba(0, 162, 235, 0.8)");

      }

    });



    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labelList,
        datasets: [{
          label: '體溫趨勢圖',
          data: this.temperatureList,
          backgroundColor: this.backgroundKey,
          borderColor: this.borderKey,
          borderWidth: 3,
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }
}

class ChartTemperature {

  labels: string; //日期
  bodyTemperature: number; //體溫


  //底色
  //未發燒:'rgba(75, 192, 192, 0.1)',
  //發燒:'rgba(255, 0, 0, 0.1)',
  backgroundColor: string

  //線色
  //未發燒:'rgba(0, 162, 235, 1)',
  //發燒:'rgba(255, 0, 0, 1)',
  borderColor: string


}

