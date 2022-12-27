import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { StorageService } from '../storage.service';

import { environment } from '../../environments/environment';
import { Credentials } from './credentials';
import { Availability } from '../admin/venues/venue/venue';
import { Reservation } from '../admin/reservations/reservation/reservation';
import { Step } from './company';
import { Info } from '../admin/infos/info';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private corlief: String = `${environment.corlief}/company`;
  private credentials: Credentials;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  auth(token: String): Observable<Credentials> {
    const headers = new HttpHeaders({ Authorization: `bearer ${token}` });
    return this.http.get<Credentials>(`${this.corlief}/auth`, { headers: headers });
  }

  clearToken() {
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

  saveToken(token: String) {
    this.storage.setItem('token', token);
  }

  getCredentials(): Credentials {
    return this.credentials;
  }

  updateCredentials(credentials: Credentials) {
    this.credentials = credentials;
  }

  getVenueAvailability(): Observable<Availability> {
    return this.http.get<Availability>(`${this.corlief}/venue`, this.getHeaders());
  }

  getReservations(latest: boolean): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.corlief}/reservation?latest=${latest}`, this.getHeaders()
    );
  }

  makeReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(
      `${this.corlief}/reservation`, {
      stands: reservation.stands,
      activities: reservation.activities
    }, this.getHeaders()
    );
  }

  cancelReservation(): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.corlief}/reservation`, this.getHeaders());
  }

  getCompanyStep(): Observable<Step> {
    return this.http.get<Step>(`${this.corlief}/step`, this.getHeaders());
  }

  submitInfo(companyInfo: Info): Observable<Info> {
    return this.http.post<Info>(
      `${this.corlief}/info`, {
        info: companyInfo.info,
        titles: companyInfo.titles
      }, this.getHeaders()
    );
  }
}
