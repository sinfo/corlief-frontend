import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../admin/login/login.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private login: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.login.isLoggedIn();
    console.log('isAuthenticated', isAuthenticated);

    if (!isAuthenticated) {
      this.router.navigate(['admin/login']);
    }

    return isAuthenticated;
  }
}
