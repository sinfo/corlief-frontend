import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CorliefService } from './admin/corlief.service';
import { AdminGuard } from './auth/admin.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './admin/login/login.component';
import { HomeComponent } from './admin/home/home.component';

const appRoutes: Routes = [
  {
    path: 'admin',
    component: HomeComponent,
    canActivate: [ AdminGuard ]
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    CorliefService,
    AdminGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
