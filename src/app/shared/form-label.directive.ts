import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'label[prFormLabel]'
})
export class FormLabelDirective {

  private _isInvalid = false;

  constructor() { }

  set isInvalid(value: boolean) {
    this._isInvalid = value;
  }

  @HostBinding('class.text-danger')
  get isInvalid() {
    return this._isInvalid;
  }

}
