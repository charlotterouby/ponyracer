import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'pr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  loginCtrl: FormControl;
  passwordCtrl: FormControl;
  birthYearCtrl: FormControl;

  constructor(private fb: FormBuilder) {
    this.loginCtrl = fb.control('', Validators.required);
    this.passwordCtrl = fb.control('', Validators.required);
    this.birthYearCtrl = fb.control('', Validators.required);

    this.userForm = fb.group({
      login: this.loginCtrl,
      password: this.passwordCtrl,
      birthYear: this.birthYearCtrl
    });
  }

  ngOnInit() {}

  register() {}

}
