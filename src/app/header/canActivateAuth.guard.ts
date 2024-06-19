import {inject} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

export const canActivateAuthGuard = () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  if(authService.userSubject.value){
    return true;
  }

  router.navigate(['/auth'])

  return false;
}
