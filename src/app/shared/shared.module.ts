import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormControlValidationDirective } from './form-control-validation.directive';
import { FormLabelValidationDirective } from './form-label-validation.directive';
import { FormLabelDirective } from './form-label.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormControlValidationDirective,
    FormLabelValidationDirective,
    FormLabelDirective
  ],
  exports: [
    FormControlValidationDirective,
    FormLabelValidationDirective,
    FormLabelDirective,
    NgbModule
  ]
})
export class SharedModule {
}
