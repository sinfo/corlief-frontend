import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ClipboardModule } from 'ngx-clipboard';

import { AppRoutes } from './app.routes';

import { AdminGuard } from './auth/admin.guard';
import { CompanyGuard } from './auth/company.guard';

import { SortStandsPipe } from './views/admin/venues/venue/sort-stands.pipe';
import { CompleteCompanyInfoPipe } from './views/admin/links/complete-company-info.pipe';
import { GetArrayOfParticipationDaysPipe } from './views/admin/links/link/get-array-of-participation-days.pipe';
import { DatePtPipe } from './views/company/welcome/date-pt.pipe';
import {DateEnPipe} from './views/company/welcome/date-en.pipe';
import {PtDatePipe} from './views/company/company-reservations/pt-date.pipe';
import { StandsDisplayPipe } from './views/company/company-reservations/reservation-card/stands-display.pipe';

import { StorageService } from 'src/app/storage.service';
import { LinksService } from 'src/app/views/admin/links/links.service';
import { VenuesService } from 'src/app/views/admin/venues/venues.service';
import { CanvasService } from 'src/app/views/admin/venues/venue/venue-image/canvas/canvas.service';
import { CompanyService } from 'src/app/views/company/company.service';
import { ReservationsService } from 'src/app/views/admin/reservations/reservations.service';
import { DeckService } from 'src/app/services/deck.service';

import { AppComponent } from './app.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { AdminComponent } from './views/admin/admin.component';
import { LinksComponent } from './views/admin/links/links.component';
import { VenuesComponent } from './views/admin/venues/venues.component';
import { UploadComponent } from './views/admin/venues/upload/upload.component';
import { VenueComponent } from './views/admin/venues/venue/venue.component';
import { CanvasComponent } from './views/admin/venues/venue/venue-image/canvas/canvas.component';
import { VenueImageComponent } from './views/admin/venues/venue/venue-image/venue-image.component';
import { LinkComponent } from './views/admin/links/link/link.component';
import { CompanyComponent } from './views/company/company.component';
import { ReservationsComponent } from './views/admin/reservations/reservations.component';
import { ReservationComponent } from './views/admin/reservations/reservation/reservation.component';
import { BuildTablePipe } from './views/admin/reservations/build-table.pipe';
import { FilterReservationsPipe } from './views/admin/reservations/filter-reservations.pipe';
import { WelcomeComponent } from './views/company/welcome/welcome.component';
import { CompanyReservationsComponent } from './views/company/company-reservations/company-reservations.component';
import { ReservationCardComponent } from './views/company/company-reservations/reservation-card/reservation-card.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

library.add(fas);


@NgModule({
  declarations: [
    AppComponent,
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
  })
  ],
  providers: [
    StorageService,
    AdminGuard,
    CompanyGuard,
    DeckService,
    LinksService,
    VenuesService,
    CanvasService,
    CompanyService,
    ReservationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
