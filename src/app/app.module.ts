import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ClipboardModule } from 'ngx-clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { AppRoutes } from './app.routes';

import { AdminGuard } from './auth/admin.guard';
import { CompanyGuard } from './auth/company.guard';

import { SortStandsPipe } from './admin/venues/venue/sort-stands.pipe';
import { CompleteCompanyInfoPipe } from './admin/links/complete-company-info.pipe';
import { GetArrayOfParticipationDaysPipe } from './admin/links/link/get-array-of-participation-days.pipe';
import { DatePtPipe } from './company/welcome/date-pt.pipe';
import { DateEnPipe } from './company/welcome/date-en.pipe';
import { PtDatePipe } from './company/company-reservations/pt-date.pipe';
import { StandsDisplayPipe } from './company/company-reservations/reservation-card/stands-display.pipe';

import { LoginService } from 'src/app/admin/login/login.service';
import { StorageService } from 'src/app/storage.service';
import { LinksService } from 'src/app/admin/links/links.service';
import { VenuesService } from 'src/app/admin/venues/venues.service';
import { UploadService } from 'src/app/admin/venues/upload/upload.service';
import { CanvasService } from 'src/app/admin/venues/venue/venue-image/canvas/canvas.service';
import { CompanyService } from 'src/app/company/company.service';
import { ReservationsService } from 'src/app/admin/reservations/reservations.service';
import { DeckService } from 'src/app/deck/deck.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './admin/login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AdminComponent } from './admin/admin.component';
import { LinksComponent } from './admin/links/links.component';
import { VenuesComponent } from './admin/venues/venues.component';
import { UploadComponent } from './admin/venues/upload/upload.component';
import { VenueComponent } from './admin/venues/venue/venue.component';
import { CanvasComponent } from './admin/venues/venue/venue-image/canvas/canvas.component';
import { VenueImageComponent } from './admin/venues/venue/venue-image/venue-image.component';
import { LinkComponent } from './admin/links/link/link.component';
import { CompanyComponent } from './company/company.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ReservationsComponent } from './admin/reservations/reservations.component';
import { ReservationComponent } from './admin/reservations/reservation/reservation.component';
import { BuildTablePipe } from './admin/reservations/build-table.pipe';
import { FilterReservationsPipe } from './admin/reservations/filter-reservations.pipe';
import { WelcomeComponent } from './company/welcome/welcome.component';
import { CompanyReservationsComponent } from './company/company-reservations/company-reservations.component';
import { ReservationCardComponent } from './company/company-reservations/reservation-card/reservation-card.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivityDialogComponent } from './admin/venues/venue/dialogs/activity-dialog/activity-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material';
import { ActivityDisplayPipe } from './company/company-reservations/reservation-card/activity-display.pipe';
import { InfosComponent } from './admin/infos/infos.component';
import { CompanyInfosComponent } from './company/company-infos/company-infos.component';

library.add(fas);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotfoundComponent,
    AdminComponent,
    LinksComponent,
    VenuesComponent,
    UploadComponent,
    VenueComponent,
    CanvasComponent,
    VenueImageComponent,
    SortStandsPipe,
    LinkComponent,
    CompleteCompanyInfoPipe,
    GetArrayOfParticipationDaysPipe,
    CompanyComponent,
    UnauthorizedComponent,
    ReservationsComponent,
    ReservationComponent,
    BuildTablePipe,
    FilterReservationsPipe,
    WelcomeComponent,
    CompanyReservationsComponent,
    DatePtPipe,
    DateEnPipe,
    PtDatePipe,
    ReservationCardComponent,
    StandsDisplayPipe,
    ActivityDialogComponent,
    ActivityDisplayPipe,
    InfosComponent,
    CompanyInfosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutes,
    NgbModule.forRoot(),
    FontAwesomeModule,
    LazyLoadImageModule,
    ClipboardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatAutocompleteModule
  ],
  providers: [
    StorageService,
    LoginService,
    AdminGuard,
    CompanyGuard,
    DeckService,
    LinksService,
    VenuesService,
    UploadService,
    CanvasService,
    CompanyService,
    ReservationsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ActivityDialogComponent],
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
