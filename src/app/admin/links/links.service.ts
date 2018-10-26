import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subscription } from 'rxjs/internal/Subscription';

import { environment } from 'src/environments/environment';
import { StorageService } from '../../storage.service';
import { Credentials } from '../login/credentials';

import { DeckService } from 'src/app/deck/deck.service';

import { Link, LinkForm } from './link/link';
import { Companies } from './link/companies';
import { Company } from 'src/app/deck/company';
import { Event } from 'src/app/deck/event';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  private corlief = `${environment.corlief}/link`;
  private credentials: Credentials;

  companies: Companies;

  event: Event;

  eventSubscription: Subscription;
  deckCompaniesSubscription: Subscription;

  private companiesSubject: ReplaySubject<Companies> = new ReplaySubject<Companies>();

  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private deckService: DeckService
  ) {
    this.companies = new Companies();

    const credentials = <Credentials>this.storage.getItem('credentials');
    this.credentials = credentials;

    this.headers = new HttpHeaders({
      'Authorization': `${credentials.user} ${credentials.token}`,
      'Content-Type': 'application/json'
    });

    this.eventSubscription = this.deckService.getEventSubject()
      .subscribe(event => {
        this.event = event;
      });

    this.deckCompaniesSubscription = this.deckService.getDeckCompaniesSubject()
      .subscribe(companies => {
        this.companies.updateCompanies(companies, this.event.id);
        this.updateLinks();
      });
  }

  getCompaniesSubscription(): Observable<Companies> {
    return this.companiesSubject.asObservable();
  }

  updateLinks(edition?: string) {
    edition
      ? this.getLinks({ edition: edition }).subscribe(links => {
        const l = links instanceof Link ? [links] as [Link] : links as [Link];
        this.companies.updateLinks(l);
        this.companiesSubject.next(this.companies);
      })
      : this.verifyAndGetLinks().subscribe(links => {
        this.companies.updateLinks(links);
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

  verifyAndGetLinks(): Observable<[Link]> {
    return this.http.get<[Link]>(`${this.corlief}/validity`, { headers: this.headers });
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

  check(companyId: String): Observable<{ expirationDate: Date }> {
    const headers = this.headers.set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.get<{ expirationDate: Date }>(
      `${this.corlief}/company/${companyId}/validity`,
      { headers: headers }
    );
  }
}
