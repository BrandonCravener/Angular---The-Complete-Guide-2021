import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  loginMode = true;

  constructor(private authService: AuthService) { }

  switchMode() {
    this.loginMode = !this.loginMode
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const { email, password } = form.value

    if (this.loginMode) {

    } else {
      this.authService.signup(email, password).subscribe(resData => {
        console.log(resData)
      }, err => {
        console.error(err)
      })
    }

    form.reset()
  }

}
