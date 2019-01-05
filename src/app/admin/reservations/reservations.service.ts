import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { environment } from '../../../environments/environment';

import { StorageService } from '../../storage.service';
import { CompanyService } from 'src/app/company/company.service';

import { Credentials } from '../login/credentials';
import { Reservation } from './reservation/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  private url: String = `${environment.corlief}/reservation`;
  private headers: HttpHeaders;

  private reservationsSubject: BehaviorSubject<Reservation[]>
    = new BehaviorSubject<Reservation[]>(undefined);

  private reservationSubject: BehaviorSubject<Reservation>
    = new BehaviorSubject<Reservation>(undefined);

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private companyService: CompanyService
  ) {
    const credentials = this.storage.getItem('credentials') as Credentials;

    this.headers = credentials
      ? new HttpHeaders({
        'Authorization': `${credentials.user} ${credentials.token}`,
        'Content-Type': 'application/json'
      })
      : null;
  }

  setReservations(reservations: Reservation[]) {
    this.reservationsSubject.next(reservations);
  }

  getReservationsSubject(): Observable<Reservation[]> {
    return this.reservationsSubject.asObservable();
  }

  setReservation(reservation: Reservation) {
    this.reservationSubject.next(reservation);
  }

  getReservationSubject(): Observable<Reservation> {
    return this.reservationSubject.asObservable();
  }

  getFromEdition(edition: String): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.url}`, {
      headers: this.headers,
      params: { edition: edition as string }
    });
  }

  updateWithLatest(): void {
    this.getLatest().subscribe(reservations => this.setReservations(reservations));
  }

  getLatest(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.url}/latest`, { headers: this.headers });
  }

  confirm(companyId: String): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.url}/company/${companyId}/confirm`,
      { headers: this.headers });
  }

  cancel(companyId: String): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.url}/company/${companyId}/cancel`,
      { headers: this.headers });
  }

  remove(companyId: String, reservationId: number): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.url}/${reservationId}/company/${companyId}`,
      { headers: this.headers });
  }

}
