import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from '../../../environments/environment';

import { StorageService } from 'src/app/storage.service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private corlief: String = environment.corlief;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) { }

  getToken() {
    return this.storage.getItem('corlief_token');
  }

  saveToken(credentials: String) {
    this.storage.setItem('corlief_token', credentials);
  }

  login(user: String, token: String): Observable<String> {
    return this.http.post<String>(`${this.corlief}/auth/google`, { user, token }, httpOptions);
  }

  logout() {
    this.storage.removeItem('corlief_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.storage.getItem('corlief_token') !== null;
  }
}
