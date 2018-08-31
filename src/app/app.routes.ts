import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from 'src/app/auth/admin.guard';

import { HomeComponent } from 'src/app/admin/home/home.component';
import { LoginComponent } from 'src/app/admin/login/login.component';

const appRoutes: Routes = [
  {
    path: 'admin',
    component: HomeComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: 'admin'
  }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
