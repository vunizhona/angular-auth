import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthService} from "./auth.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  loading = false;
  error = ''

  private userSub: Subscription | undefined;

  constructor(public authService: AuthService, public router: Router) {}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.loading = true;

    if(this.isLoginMode){
      this.authService.login(email, password).subscribe({next: response => {
        this.loading = false;
        this.authService.autoLogout(3600)
        this.router.navigate(["/quotes"])
        }, error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.error = error?.error?.message || "Error Occurred";
        } })
    } else {
      this.authService.signup(email, password).subscribe({next: response => {
          this.loading = false;
          this.authService.autoLogout(3600)
          this.router.navigate(["/quotes"])
        }, error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.error = error?.error?.message || "Error Occurred";
        } })
    }


  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
