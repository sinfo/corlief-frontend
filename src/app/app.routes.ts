import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from 'src/app/auth/admin.guard';

import { HomeComponent } from 'src/app/admin/home/home.component';
import { LoginComponent } from 'src/app/admin/login/login.component';
import { NotfoundComponent } from 'src/app/notfound/notfound.component';
import { AdminComponent } from 'src/app/admin/admin.component';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
