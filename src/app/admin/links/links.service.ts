import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';

import { environment } from '../../../environments/environment';
import { StorageService } from '../../storage.service';
import { Credentials } from '../login/credentials';

import { Link, LinkForm } from './link/link';
import { Company } from './link/company';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  private corlief = `${environment.corlief}/link`;
  private deck = `${environment.deck}/api`;
  private credentials: Credentials;

  private companiesSubject: BehaviorSubject<[Company]> = new BehaviorSubject<[Company]>(undefined);
  private linksSubject: BehaviorSubject<[Link]> = new BehaviorSubject<[Link]>(undefined);

  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    const credentials = <Credentials>this.storage.getItem('credentials');
    this.credentials = credentials;

    this.headers = new HttpHeaders({
      'Authorization': `${credentials.user} ${credentials.token}`,
      'Content-Type': 'application/json'
    });
  }

  getCompaniesSubscription(): Observable<[Company]> {
    return this.companiesSubject.asObservable();
  }

  getLinksSubscription(): Observable<[Link]> {
    return this.linksSubject.asObservable();
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

  updateLinks(edition: string) {
    if (edition === undefined) { return; }

    this.getLinks({ edition: edition }).subscribe(links => {
      this.linksSubject.next(links as [Link]);
    });
  }

  uploadLink(form: LinkForm): Observable<Link> {
    return this.http.post<Link>(`${this.corlief}`, form, { headers: this.headers });
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
