import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CompanyService } from '../company/company.service';
import { Credentials } from '../company/credentials';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {

  constructor(
    private companyService: CompanyService,
    private storageService: StorageService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    const token = next.params.token;

    if (token) {
      return new Promise<boolean>((resolve, reject) => {
        this.companyService.auth(token).subscribe(
          credentials => {
            this.companyService.saveCredentials(credentials);
            this.router.navigate(['/']);
            resolve(true);
          }, error => {
            resolve(false);
          }
        );
      });
    }

    return this.companyService.isValid();
  }
}
