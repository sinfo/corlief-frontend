import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CompanyService } from '../company/company.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {

  constructor(
    private companyService: CompanyService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    const token = next.params.token || this.companyService.getToken();
    const tokenURL = state.url.includes('/token');

    if (token === null) {
      this.router.navigate(['unauthorized']);
      return false;
    }

    return new Promise<boolean>((resolve, reject) => {
      this.companyService.auth(token).subscribe(
        credentials => {
          this.companyService.saveCredentials(token, credentials);

          if (tokenURL) {
            this.router.navigate(['/']);
          }

          resolve(true);
        }, error => {
          this.companyService.clearCredentialsAndToken();
          this.router.navigate(['unauthorized']);
          resolve(false);
        }
      );
    });
  }
}
