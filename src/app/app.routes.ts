import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from 'src/app/auth/admin.guard';

import { HomeComponent } from 'src/app/admin/home/home.component';
import { LoginComponent } from 'src/app/admin/login/login.component';
import { NotfoundComponent } from 'src/app/notfound/notfound.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AdminGuard]
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
