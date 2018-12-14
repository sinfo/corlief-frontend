import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './auth/admin.guard';
import { CompanyGuard } from './auth/company.guard';

import { LoginComponent } from 'src/app/admin/login/login.component';
import { NotfoundComponent } from 'src/app/notfound/notfound.component';
import { AdminComponent } from 'src/app/admin/admin.component';
import { LinksComponent } from 'src/app/admin/links/links.component';
import { VenuesComponent } from 'src/app/admin/venues/venues.component';
import { CompanyComponent } from 'src/app/company/company.component';
import { UnauthorizedComponent } from 'src/app/unauthorized/unauthorized.component';
import { ReservationsComponent } from 'src/app/admin/reservations/reservations.component';
import { WelcomeComponent } from 'src/app/company/welcome/welcome.component';
import { CompanyReservationsComponent } from 'src/app/company/company-reservations/company-reservations.component';

const appRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'venues',
        component: VenuesComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'links',
        component: LinksComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'reservations',
        component: ReservationsComponent,
        canActivate: [AdminGuard]
      }
    ]
  },
  {
    path: 'token/:token',
    component: CompanyComponent,
    canActivate: [CompanyGuard]
  },
  {
    path: '',
    component: CompanyComponent,
    canActivate: [CompanyGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: WelcomeComponent,
        canActivate: [CompanyGuard]
      },
      {
        path: 'reservations',
        component: CompanyReservationsComponent,
        canActivate: [CompanyGuard]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
