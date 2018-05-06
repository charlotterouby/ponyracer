import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';
import { UserService } from '../../user.service';

@Component({
  selector: 'pr-money-history',
  templateUrl: './money-history.component.html',
  styleUrls: ['./money-history.component.css']
})
export class MoneyHistoryComponent implements AfterViewInit {

  @ViewChild('chart') private canvas: ElementRef<HTMLCanvasElement>;
  moneyChart: Chart;

  constructor(private userService: UserService) { }

  ngAfterViewInit() {
    this.userService.getMoneyHistory().subscribe(moneyHistoryData => {
      this.moneyChart = new Chart(this.canvas.nativeElement, {
        type: 'line',
        data: {
          labels: moneyHistoryData.map(item => item.instant),
          datasets: [{
            label: 'Money history',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            data: moneyHistoryData.map(item => item.money)
          }]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time'
            }]
          }
        }
      });
    });
  }
}
