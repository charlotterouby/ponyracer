import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'pr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;

  loginCtrl: FormControl;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;
  birthYearCtrl: FormControl;

  registrationFailed = false;

  static passwordMatch(passwordFormGroup: FormGroup) {
    const password = passwordFormGroup.get('password').value;
    const confirm = passwordFormGroup.get('confirmPassword').value;
    return password === confirm ? null : { matchingError: true };
  }

  constructor(private fb: FormBuilder, private userService: UserService,  private router: Router) {
    this.loginCtrl = fb.control('', [Validators.required, Validators.minLength(3)]);
    this.passwordCtrl = fb.control('', Validators.required);
    this.confirmPasswordCtrl = fb.control('', [Validators.required]);
    this.birthYearCtrl = fb.control('', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]);

    this.passwordForm = fb.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, {
      validator: RegisterComponent.passwordMatch
    });

    this.userForm = fb.group({
      login: this.loginCtrl,
      passwordForm: this.passwordForm,
      birthYear: this.birthYearCtrl
    });
  }

  ngOnInit() { }

  register() {
    const login = this.loginCtrl.value;
    const pwd = this.passwordCtrl.value;
    const birtdate = this.birthYearCtrl.value;

    this.userService.register(login, pwd, birtdate).subscribe(
      data => this.router.navigate(['/']),
      error => {
      this.registrationFailed = true;
      }
    );
  }

}
