import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription | undefined;
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe({next: user => {
        this.isAuthenticated = !!user;
    }
      }
    )
  }

  logout(): void {
    this.authService.logout();
  }

}
