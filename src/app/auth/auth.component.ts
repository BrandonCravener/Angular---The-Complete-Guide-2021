import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthRespData, AuthService } from './auth.service';

import * as fromApp from '../store/app.reducer'
import { ClearError, LoginStart, SignupStart } from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  loginMode = true;
  loading = false;
  error: string = null

  private storeSub: Subscription
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) { }
  ngOnDestroy(): void {
    if (this.storeSub) this.storeSub.unsubscribe()
  }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.loading = authState.loading
      this.error = authState.authError
    })
  }

  switchMode() {
    this.loginMode = !this.loginMode
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.loading = true;

    const { email, password } = form.value
    let authObs: Observable<AuthRespData>

    if (this.loginMode) {
      this.store.dispatch(new LoginStart({ email: email, password: password }))
    } else {
      this.store.dispatch(new SignupStart({ email: email, password: password }))
    }
    form.reset()
  }

  resetErr() {
    this.store.dispatch(new ClearError())
  }
}
