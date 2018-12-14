import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { LoginService } from '../admin/login/login.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private login: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.login.isLoggedIn();

    if (!isAuthenticated) {
      this.router.navigate(['login']);
    }

    return isAuthenticated;
  }
}
