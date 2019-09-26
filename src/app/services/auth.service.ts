import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { StorageService } from '../storage.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: StorageService,
  ) { }

  saveToken(token: String): void {
    this.storage.setItem('token', token);
  }

  getToken(): String {
    return <String>this.storage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.storage.getItem('token') !== null;
  }

  async logout() {
    this.storage.removeItem('token');
    this.storage.removeItem('company_credentials');
    window.location.href = `${environment.frontend}`;
  }

  getHeaders(): HttpHeaders {
    const token = this.storage.getItem('token');

    return token
      ? new HttpHeaders({
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      }) : null;
  }
}
