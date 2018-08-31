import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from '../../../environments/environment';
import { Credentials } from './credentials';

import { StorageService } from 'src/app/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  corlief: String = environment.corlief;

  constructor(private http: HttpClient, private storage: StorageService) { }

  saveCredentials(credentials: Credentials) {
    this.storage.setItem('credentials', credentials);
  }

  login(user: String, token: String): Observable<Credentials> {
    const headers = new HttpHeaders({ Authorization: `${user} ${token}` });
    return this.http.get<Credentials>(`${this.corlief}/auth`, { headers: headers });
  }

  logout() {
    this.storage.removeItem('credentials');
  }

  isLoggedIn(): boolean {
    return this.storage.getItem('credentials') !== null;
  }
}
