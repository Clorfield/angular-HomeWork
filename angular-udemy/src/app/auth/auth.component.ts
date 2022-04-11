import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService, private router: Router) { }

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
            this.isLoading = false;
        });

        authForm.reset();
    }

}