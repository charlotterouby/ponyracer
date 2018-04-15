import { Directive, HostBinding } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '.form-control'
})
export class FormControlValidationDirective {

  constructor(private ngControl: NgControl) { }

  @HostBinding('class.is-invalid')
  get isInvalid() {
    return this.ngControl && this.ngControl.dirty && this.ngControl.invalid ? true : false;
  }

}
