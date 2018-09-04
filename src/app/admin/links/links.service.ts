import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';

import { environment } from '../../../environments/environment';
import { StorageService } from '../../storage.service';
import { Credentials } from '../login/credentials';

import { Link } from './link/link';
import { Company } from './link/company';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  corlief = `${environment.corlief}/link`;
  deck = `${environment.deck}/api`;
  credentials: Credentials;

  companiesSubject: BehaviorSubject<[Company]> = new BehaviorSubject<[Company]>(undefined);

  headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    const credentials = <Credentials>this.storage.getItem('credentials');
    this.credentials = credentials;

    this.headers = new HttpHeaders({
      Authorization: `${credentials.user} ${credentials.token}`
    });
  }

  getCompaniesSubscription(): Observable<[Company]> {
    return this.companiesSubject.asObservable();
  }

  updateCompanies(edition: String) {
    if (edition === undefined) { return; }

    const { user, token } = this.credentials;

    this.http.get(`${this.deck}/auth/login/${user}/${token}`)
      .subscribe(() => {
        this.http.get<[Company]>(
          `${this.deck}/companies?event=${edition}&&participations=true`,
          { withCredentials: true }
        ).subscribe(companies => {
          this.companiesSubject.next(companies);
        });
      });
  }

  getLinks(filter?: {
    companyId?: string,
    edition?: string,
    token?: string
  }): Observable<Link | [Link]> {
    return this.http.get<Link | [Link]>(this.corlief, {
      headers: this.headers,
      params: filter
    });
  }

  getCompaniesWithMissingLinks(): Observable<[Company]> {
    return this.http.get<[Company]>(`${this.corlief}/missing`, { headers: this.headers });
  }
}
