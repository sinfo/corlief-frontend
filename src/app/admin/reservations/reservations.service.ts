import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { environment } from '../../../environments/environment';

import { StorageService } from '../../storage.service';

import { Credentials } from '../login/credentials';
import { Reservation } from './reservation/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  private url: String = `${environment.corlief}/venue`;
  private headers: HttpHeaders;

  private credentials: Credentials;

  private reservationSubject: BehaviorSubject<Reservation>
    = new BehaviorSubject<Reservation>(undefined);

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  setReservation(reservation: Reservation) {
    this.reservationSubject.next(reservation);
  }

  getReservationSubject(): Observable<Reservation> {
    return this.reservationSubject.asObservable();
  }
}
