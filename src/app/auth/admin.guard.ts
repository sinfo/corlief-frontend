import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {AuthService} from '../services/auth.service';


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    const token = next.params.token || this.authService.getToken();

    if (token === null) {
      this.authService.logout();
      return false;
    } else {
        this.authService.saveToken(token);
        return true;
    }
  }
}
