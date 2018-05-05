import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pr-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  @Input() type: 'success' | 'info' | 'warning' | 'danger' = 'warning';
  @Input() dismissible = true;
  @Output() close = new EventEmitter<void>();

  constructor() { }

  get alertClasses(): string {
    return `alert alert-${this.type}`;
  }
  closeHandler() {
    this.close.emit();
  }

}
