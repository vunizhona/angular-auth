import { Injectable } from '@angular/core';
import {BehaviorSubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

export interface User {
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTime: number | undefined

  get user(){
    return this.userSubject.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string){
    return this.http.post<User>('http://localhost:3000/signup', {email, password}).pipe(tap(response => {
      this.handleAuthentication(response.email, response.token);
    }))
  }

  login(email: string, password: string){
    return this.http.post<User>('http://localhost:3000/login', {email, password}).pipe(tap(response => {
      this.handleAuthentication(response.email, response.token);
    }))
  }

  autoLogin(){
    const userData = JSON.parse(localStorage.getItem('userData') || '');
    if(!userData){
      return
    }
    this.userSubject.next(userData);
    this.autoLogout(3600)
  }

  logout(){
    this.userSubject.next(null);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTime){
      clearInterval(this.tokenExpirationTime);
    }
    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTime = setTimeout(() => {
      this.logout()
    }, expirationDuration);
  }


  private handleAuthentication(email: string, token: string) {
    const user: User = {email, token}
    this.userSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
