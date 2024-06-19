import { Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {QuotesComponent} from "./quotes/quotes.component";
import {canActivateAuthGuard} from "./header/canActivateAuth.guard";

export const routes: Routes = [
  {path: '', redirectTo: '/auth', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
  {path: 'quotes', component: QuotesComponent, canActivate: [() => canActivateAuthGuard()]},
  {path: '**', redirectTo: '/auth', pathMatch: 'full'},
];
