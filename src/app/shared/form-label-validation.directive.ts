import { Directive, ContentChild, AfterContentInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormLabelDirective } from './form-label.directive';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '.form-group'
})
export class FormLabelValidationDirective implements AfterContentInit, OnDestroy {

  statusSubscription: Subscription;
  @ContentChild('.form-control') ngControl: NgControl;
  @ContentChild('label[prFormLabel]') label: FormLabelDirective;

  constructor() { }

  ngAfterContentInit() {
    if (this.ngControl && this.label) {
      this.setLabelValidity();
      this.statusSubscription = this.ngControl.statusChanges.subscribe(() => this.setLabelValidity());
    }
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  setLabelValidity() {
    this.label.isInvalid = this.ngControl.dirty && this.ngControl.invalid;
  }
}
