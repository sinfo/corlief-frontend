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
import { CompanyBatchPipe } from './admin/home/company-batch.pipe';

import { LoginService } from 'src/app/admin/login/login.service';
import { StorageService } from 'src/app/storage.service';
import { LinksService } from 'src/app/admin/links/links.service';
import { VenuesService } from 'src/app/admin/venues/venues.service';
import { UploadService } from 'src/app/admin/venues/upload/upload.service';
import { CanvasService } from 'src/app/admin/venues/venue/venue-image/canvas/canvas.service';
import { EventService } from 'src/app/admin/event/event.service';
import { CompanyService } from 'src/app/company/company.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './admin/login/login.component';
import { HomeComponent } from './admin/home/home.component';
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

library.add(fas);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
    CompanyBatchPipe,
    CompanyComponent,
    UnauthorizedComponent,
    ReservationsComponent,
    ReservationComponent,
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
    LinksService,
    VenuesService,
    UploadService,
    CanvasService,
    EventService,
    CompanyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
