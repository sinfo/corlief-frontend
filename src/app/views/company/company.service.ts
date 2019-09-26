import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { StorageService } from '../../storage.service';

import { Availability } from '../admin/venues/venue/venue';
import { Reservation } from '../admin/reservations/reservation/reservation';
import {CorliefService} from '../../services/corlief.service';
import {Credentials} from '../../models/credentials';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private credentials;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private corliefService: CorliefService
  ) { }

  getVenueAvailability(): Observable<Availability> {
    return this.corliefService.getVenueAvailability();
  }

  getReservations(latest: boolean): Observable<Reservation[]> {
    return this.corliefService.getReservations(latest);
  }

  makeReservation(reservation: Reservation): Observable<Reservation> {
    return this.corliefService.makeReservation(reservation);
  }

  cancelReservation(): Observable<Reservation> {
    return this.corliefService.cancelReservation();
  }

  getCredentials(): Credentials | null {
    return <Credentials | null>this.storage.getItem('credentials');
  }

  updateCredentials(credentials: Credentials) {
    this.credentials = credentials;
    this.storage.setItem('credentials', credentials);
  }
}
