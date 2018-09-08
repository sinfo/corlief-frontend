import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { StorageService } from '../storage.service';

import { environment } from '../../environments/environment';
import { Credentials } from './credentials';
import { Availability } from '../admin/venues/venue/venue';

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

  clearCredentialsAndToken() {
    this.storage.removeItem('token');
    this.storage.removeItem('company_credentials');
  }

  private getHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    return token === null
      ? { headers: null }
      : { headers: new HttpHeaders({ Authorization: `bearer ${token}` }) };
  }

  getToken(): String | null {
    return <String | null>this.storage.getItem('token');
  }

  saveCredentials(token: String, credentials: Credentials) {
    this.storage.setItem('token', token);
    this.storage.setItem('company_credentials', credentials);
  }

  getVenueAvailability(): Observable<Availability> {
    return this.http.get<Availability>(`${this.corlief}/venue`, this.getHeaders());
  }
}