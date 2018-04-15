import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'pr-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() type: 'success' | 'info' | 'warning' | 'danger' = 'warning';
  @Input() dismissible = true;
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  get alertClasses(): string {
    return `alert alert-${this.type}`;
  }

  closeHandler() {
    this.close.emit();
  }

}
