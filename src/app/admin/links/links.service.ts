import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';

import { environment } from '../../../environments/environment';
import { StorageService } from '../../storage.service';
import { Credentials } from '../login/credentials';

import { EventService } from '../event/event.service';

import { Link, LinkForm } from './link/link';
import { Company, Companies } from './link/company';
import { Event } from '../event/event';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  private corlief = `${environment.corlief}/link`;
  private deck = `${environment.deck}/api`;
  private credentials: Credentials;

  companies: Companies;

  event: Event;
  eventSubscription: Subscription;

  private companiesSubject: BehaviorSubject<Companies> = new BehaviorSubject<Companies>(undefined);

  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private eventService: EventService
  ) {
    this.companies = new Companies();

    const credentials = <Credentials>this.storage.getItem('credentials');
    this.credentials = credentials;

    this.headers = new HttpHeaders({
      'Authorization': `${credentials.user} ${credentials.token}`,
      'Content-Type': 'application/json'
    });

    this.eventSubscription = this.eventService.getEventSubject().subscribe(event => {
      if (event) {
        this.event = event;
        this.updateCompanies(event.id, true);
      }
    });
  }

  private deckAuth(): Observable<object> {
    const { user, token } = this.credentials;
    return this.http.get(`${this.deck}/auth/login/${user}/${token}`);
  }

  private getCompanies(edition: String, force?: boolean): Observable<[Company]> {
    return force || !this.companies.all.length
      ? this.http.get<[Company]>(
        `${this.deck}/companies?event=${edition}&&participations=true`,
        { withCredentials: true }
      )
      : of(this.companies.all);
  }

  getCompaniesSubscription(): Observable<Companies> {
    return this.companiesSubject.asObservable();
  }

  updateCompanies(edition: String, force?: boolean) {
    if (edition === undefined) { return; }

    if (force === false && this.companies.all.length > 0) {
      return this.companiesSubject.next(this.companies);
    }

    this.deckAuth().subscribe(() => {
      this.getCompanies(edition, true).subscribe(companies => {
        this.companies.updateCompanies(companies, edition);
        this.updateLinks(edition);
      });
    });
  }

  updateLinks(edition: String) {
    if (edition === undefined) { return; }

    this.getLinks({ edition: edition as string }).subscribe(links => {
      const l = links instanceof Link ? [links] as [Link] : links as [Link];
      this.companies.updateLinks(l);
      this.companiesSubject.next(this.companies);
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

  extend(companyId: String, edition: String, form: { expirationDate: Date }): Observable<Link> {
    return this.http.put<Link>(
      `${this.corlief}/company/${companyId}/edition/${edition}/extend`,
      form,
      { headers: this.headers });
  }

  revoke(companyId: String, edition: String): void {
    this.http.get<Link>(
      `${this.corlief}/company/${companyId}/edition/${edition}/revoke`,
      { headers: this.headers }
    ).subscribe(link => {
      this.updateLinks(edition as string);
    });
  }
}
