import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ClipboardModule } from 'ngx-clipboard';

import { AppRoutes } from './app.routes';

import { AdminGuard } from './auth/admin.guard';
import { CompanyGuard } from './auth/company.guard';

import { SortStandsPipe } from './admin/venues/venue/sort-stands.pipe';
import { CompleteCompanyInfoPipe } from './admin/links/complete-company-info.pipe';
import { GetArrayOfParticipationDaysPipe } from './admin/links/link/get-array-of-participation-days.pipe';
import { DatePtPipe } from './company/welcome/date-pt.pipe';
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
    ReservationCardComponent,
    StandsDisplayPipe,
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
    ClipboardModule
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
  bootstrap: [AppComponent]
})
export class AppModule { }
