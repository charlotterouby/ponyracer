import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../user.service';
import { Chart } from 'chart.js';

@Component({
  templateUrl: './money-history.component.html',
  styleUrls: ['./money-history.component.css']
})
export class MoneyHistoryComponent implements AfterViewInit {
  @ViewChild('chart', { static: false }) canvas: ElementRef<HTMLCanvasElement>;

  moneyChart: Chart;

  constructor(private userService: UserService) {}

  ngAfterViewInit() {
    const ctx = this.canvas.nativeElement;
    this.userService.getMoneyHistory().subscribe(history => {
      this.moneyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: history.map(event => event.instant),
          datasets: [
            {
              label: 'Money history',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              data: history.map(event => event.money)
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                type: 'time'
              }
            ]
          }
        }
      });
    });
  }
}
