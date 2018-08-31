import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/admin/login/login.service';
import { Credentials } from './credentials';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: String;
  token: String;
  loading = false;
  error: String;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  changeLoading() {
    this.loading = !this.loading;
  }

  login() {
    this.changeLoading();
    this.loginService.login(this.user, this.token)
      .subscribe(
      (credentials: Credentials) => {
        this.changeLoading();
        this.error = undefined;
        this.loginService.saveCredentials(credentials);
        this.router.navigate(['/']);
      },
      error => {
        this.changeLoading();

        if (error.status === 401) {
          this.error = 'Invalid credentials';
        } else if (error.status === 0) {
          this.error = 'Server down. Please contact the administrator';
        } else {
          this.error = 'Unknown error';
        }
      }
      );
  }

}
