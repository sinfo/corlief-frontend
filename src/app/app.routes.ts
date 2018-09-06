import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './auth/admin.guard';
import { CompanyGuard } from './auth/company.guard';

import { HomeComponent } from 'src/app/admin/home/home.component';
import { LoginComponent } from 'src/app/admin/login/login.component';
import { NotfoundComponent } from 'src/app/notfound/notfound.component';
import { AdminComponent } from 'src/app/admin/admin.component';
import { LinksComponent } from 'src/app/admin/links/links.component';
import { VenuesComponent } from 'src/app/admin/venues/venues.component';
import { CompanyComponent } from 'src/app/company/company.component';
import { UnauthorizedComponent } from 'src/app/unauthorized/unauthorized.component';

const appRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'venues',
        component: VenuesComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'links',
        component: LinksComponent,
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
    pathMatch: 'full',
    component: CompanyComponent,
    canActivate: [CompanyGuard]
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
