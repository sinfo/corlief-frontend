import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { StorageService } from '../storage.service';

import { environment } from '../../environments/environment';
import { Credentials } from './credentials';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private corlief: String = `${environment.corlief}/company`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  auth(token: String): Observable<Credentials> {
    const headers = new HttpHeaders({ Authorization: `bearer ${token}` });
    return this.http.get<Credentials>(`${this.corlief}/auth`, { headers: headers });
  }

  saveCredentials(credentials: Credentials) {
    this.storage.setItem('company_credentials', credentials);
  }

  isValid(): boolean {
    return this.storage.getItem('company_credentials') !== null;
  }
}
