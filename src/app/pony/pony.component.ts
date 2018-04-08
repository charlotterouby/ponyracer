import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  templateUrl: './pony.component.html',
  styleUrls: ['./pony.component.css']
})
export class PonyComponent implements OnInit {
  @Input() ponyModel: PonyModel;
  @Input() isRunning: boolean;
  @Input() isBoosted: boolean;
  @Output() ponyClicked = new EventEmitter<PonyModel>();

  constructor() { }

  ngOnInit() {
  }

  getPonyImageUrl() {
    if (this.isRunning && !this.isBoosted) {
      return `assets/images/pony-${this.ponyModel.color.toLowerCase()}-running.gif`;
    }
    if (this.isRunning && this.isBoosted) {
      return `assets/images/pony-${this.ponyModel.color.toLowerCase()}-rainbow.gif`;
    }
    return `assets/images/pony-${this.ponyModel.color.toLowerCase()}.gif`;
  }

  onClickPony() {
    this.ponyClicked.emit(this.ponyModel);
  }

}
