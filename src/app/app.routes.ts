import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './auth/admin.guard';
import { CompanyGuard } from './auth/company.guard';

import { NotfoundComponent } from 'src/app/views/notfound/notfound.component';
import { AdminComponent } from 'src/app/views/admin/admin.component';
import { LinksComponent } from 'src/app/views/admin/links/links.component';
import { VenuesComponent } from 'src/app/views/admin/venues/venues.component';
import { CompanyComponent } from 'src/app/views/company/company.component';
import { ReservationsComponent } from 'src/app/views/admin/reservations/reservations.component';
import { WelcomeComponent } from 'src/app/views/company/welcome/welcome.component';
import { CompanyReservationsComponent } from 'src/app/views/company/company-reservations/company-reservations.component';

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
    path: 'company',
    component: CompanyComponent,
    canActivate: [CompanyGuard],
    children: [
      {
        path: ':token',
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
    path: '**',
    component: NotfoundComponent
  }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
