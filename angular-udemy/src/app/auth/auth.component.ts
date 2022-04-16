import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    @ViewChild(PlaceholderDirective, { static: true }) alertHost: PlaceholderDirective;
    onAlertCloseSub: Subscription;
    private storeSub: Subscription;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>) { }

        ngOnInit(): void {
            this.storeSub = this.store.select('auth').subscribe(authState => {
                this.isLoading = authState.loading;
                this.error = authState.authError;

                if (this.error) {
                    this.showErrorAlert(this.error);
                }
            });
        }

    onSwitchMode(): void {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm: NgForm): void {
        if (authForm.invalid) {
            return;
        }

        const email = authForm.value.email;
        const password = authForm.value.password;

        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({
                email,
                password
            }));
        } else {
            this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
        }

        authForm.reset();
    }

    onHandleErrorClose(): void {
        this.store.dispatch(new AuthActions.ClearError());
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

        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }

}