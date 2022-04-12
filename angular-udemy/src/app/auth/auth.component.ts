import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    @ViewChild(PlaceholderDirective, { static: true }) alertHost: PlaceholderDirective;
    onAlertCloseSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

    onSwitchMode(): void {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm: NgForm): void {
        if (authForm.invalid) {
            return;
        }

        const email = authForm.value.email;
        const password = authForm.value.password;

        let authObs: Observable<AuthResponseData | string>;

        this.isLoading = true;

        if (this.isLoginMode) {
            authObs = this.authService.logIn(email, password);
        } else {
            authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe(resData => {
            console.log(resData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        },
        errorMessage => {
            this.error = errorMessage;
            this.showErrorAlert(errorMessage);
            this.isLoading = false;
        });

        authForm.reset();
    }

    onHandleErrorClose(): void {
        this.error = null;
    }

    private showErrorAlert(message: string): void {
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;

        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    
        componentRef.instance.message = message;
        this.onAlertCloseSub = componentRef.instance.close.subscribe(() => {
            this.onAlertCloseSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy(): void {
        if (this.onAlertCloseSub) {
            this.onAlertCloseSub.unsubscribe();
        }
    }

}