/* tslint:disable:directive-selector */
import { Directive, AfterContentInit, ContentChild } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FormLabelDirective } from './form-label.directive';

@Directive({
  selector: '.form-group'
})
export class FormLabelValidationDirective implements AfterContentInit {
  @ContentChild(NgControl, { static: false }) ngControl: NgControl;

  @ContentChild(FormLabelDirective, { static: false }) label: FormLabelDirective;

  ngAfterContentInit() {
    if (this.ngControl && this.label) {
      this.setLabelValidity();
      this.ngControl.statusChanges.subscribe(() => this.setLabelValidity());
    }
  }

  private setLabelValidity() {
    this.label.isInvalid = this.ngControl.invalid && this.ngControl.dirty;
  }
}
