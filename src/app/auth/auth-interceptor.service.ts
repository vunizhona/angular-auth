import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptorService  implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authService.userSubject.value;

    if(!user){
      return next.handle(req)
    }

    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + user.token)
    })

    return next.handle(modifiedReq)
  }
}
