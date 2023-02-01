import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthRespData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  loginMode = true;
  loading = false;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  private closeSub: Subscription

  constructor(private authService: AuthService, private router: Router, private CFR: ComponentFactoryResolver) { }


  ngOnDestroy(): void {
    if (this.closeSub) this.closeSub.unsubscribe()
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
      authObs = this.authService.login(email, password)
    } else {
      authObs = this.authService.signup(email, password)
    }

    authObs.subscribe(resData => {
      console.log(resData)

      this.loading = false
      this.router.navigate(['/recipes'])
    }, errMsg => {
      console.error(errMsg)

      this.showErrorAlert(errMsg)
      this.loading = false
    })

    form.reset()
  }

  private showErrorAlert(msg: string) {
    const alertComponentFactory = this.CFR.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef

    hostViewContainerRef.clear()
    const compRef = hostViewContainerRef.createComponent(alertComponentFactory)
    compRef.instance.message = msg;
    this.closeSub = compRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      hostViewContainerRef.clear()
    })
  }
}
