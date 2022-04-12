import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { environment } from '../../environments/environment';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    userSubject = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) { }

    signUp(email: string, password: string): Observable<AuthResponseData | string> {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    if (typeof(resData) === 'string') {
                        return resData;
                    }

                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                })
            );
    }

    autoLogin(): void {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.userSubject.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logIn(email: string, password: string): Observable<AuthResponseData | string> {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    if (typeof(resData) === 'string') {
                        return resData;
                    }

                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                })
            );
    }

    logOut(): void {
        this.userSubject.next(null);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.router.navigate(['/auth']);
    }

    autoLogout(expirationDuration: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logOut();
        }, expirationDuration);
    }

    private handleError(errorResponse: HttpErrorResponse): Observable<string> {
        let errorMessage = 'An error occurred!';
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
        }

        switch(errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!'; 
                break;    
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist!'; 
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct!';        
        }
        return throwError(errorMessage);
    }

    private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number): void {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email,
            localId,
            idToken,
            expirationDate
        );
        this.userSubject.next(user);
        this.autoLogout(expiresIn * 1000);

        localStorage.setItem('userData', JSON.stringify(user));
    }

}