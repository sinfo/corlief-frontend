import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import {Link, LinkEdit, LinkForm} from '../views/admin/links/link/link';

import {Company} from '../models/company';
import {Event} from '../models/event';
import {Availability, Venue} from '../views/admin/venues/venue/venue';
import {Reservation} from '../views/admin/reservations/reservation/reservation';
import {Stand} from '../views/admin/venues/venue/stand';

import {AuthService} from './auth.service';
import {Credentials} from '../models/credentials';


@Injectable({
  providedIn: 'root'
})
export class CorliefService {

  private corlief = `${environment.corlief}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /*************************************************************
   *                     Admin Link methods                    *
   *************************************************************/

  getLinks(filter?: {
    companyId?: string,
    edition?: string,
    token?: string
  }): Observable<Link | Link[]> {
    return this.http.get<Link | Link[]>(`${this.corlief}/link`, {
      headers: this.authService.getHeaders(),
      params: filter
    });
  }

  uploadLink(form: LinkForm): Observable<Link> {
    return this.http.post<Link>(`${this.corlief}/link`, form, { headers: this.authService.getHeaders() });
  }

  edit(form: LinkEdit, event: Event, companyId: String): Observable<Link> {
    return this.http.put<Link>(
      `${this.corlief}/link/company/${companyId}/edition/${event.id}`,
      form,
      { headers: this.authService.getHeaders() });
  }

  extend(companyId: String, edition: String, form: { expirationDate: Date }): Observable<Link> {
    return this.http.put<Link>(
      `${this.corlief}/link/company/${companyId}/edition/${edition}/extend`,
      form,
      { headers: this.authService.getHeaders() });
  }

  revoke(companyId: String, edition: String) {
    return this.http.get<Link>(
      `${this.corlief}/link/company/${companyId}/edition/${edition}/revoke`,
      { headers: this.authService.getHeaders() }
    );
  }

  check(companyId: String): Observable<{ expirationDate: Date }> {
    const headers = this.authService.getHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.get<{ expirationDate: Date }>(
      `${this.corlief}/link/company/${companyId}/validity`,
      { headers: headers }
    );
  }

  getCompaniesWithMissingLinks(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.corlief}/link/missing`, { headers: this.authService.getHeaders() });
  }

  verifyAndGetLinks(): Observable<Link[]> {
    return this.http.get<Link[]>(`${this.corlief}/link/validity`, { headers: this.authService.getHeaders() });
  }

  /*************************************************************
   *                     Admin Venue methods                    *
   *************************************************************/

  getVenueFromEdition(edition: String): Observable<Venue> {
    return this.http.get<Venue>(`${this.corlief}/venue/${edition}`, { headers: this.authService.getHeaders() });
  }

  getCurrentVenue(): Observable<Venue> {
    return this.http.get<Venue>(`${this.corlief}/venue/current`, { headers: this.authService.getHeaders() });
  }

  uploadVenueImage(image: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', image);

    return this.http.post<HttpEvent<{}>>(`${this.corlief}/venue/image`, formdata, {
      headers: this.authService.getHeaders(),
      reportProgress: true,
      // responseType: 'text'
    });
  }

  uploadStand(stand: Stand): Observable<Venue> {
    return this.http.post<Venue>(`${this.corlief}/venue/stand`, stand, { headers: this.authService.getHeaders() });
  }

  deleteStand(id: number): Observable<Venue> {
    return this.http.delete<Venue>(`${this.corlief}/venue/stand/${id}`, { headers: this.authService.getHeaders() });
  }

  /*************************************************************
   *                      Company methods                      *
   *************************************************************/

  authenticateCompany(token: String): Observable<Credentials> {
    const headers = this.authService.getHeaders().set('Authorization', `bearer ${token}`);
    return this.http.get<Credentials>(`${this.corlief}/company/auth`, { headers: headers });
  }

  getReservations(latest: boolean): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.corlief}/company/reservation?latest=${latest}`, { headers: this.authService.getHeaders()}
    );
  }

  makeReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(
      `${this.corlief}/company/reservation`, reservation.stands, { headers: this.authService.getHeaders()}
    );
  }

  cancelReservation(): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.corlief}/company/reservation`, { headers: this.authService.getHeaders()});
  }

  getVenueAvailability(): Observable<Availability> {
    return this.http.get<Availability>(`${this.corlief}/company/venue`, { headers: this.authService.getHeaders()});
  }
}
