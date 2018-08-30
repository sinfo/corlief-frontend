import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CorliefService } from '../admin/corlief.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private corliefService: CorliefService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.corliefService.isLoggedIn();

    if (!isAuthenticated) {
      this.router.navigate(['admin/login']);
    }

    return isAuthenticated;
  }
}
