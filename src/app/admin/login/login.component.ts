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

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.loginService.login(this.user, this.token)
      .subscribe(
      (credentials: Credentials) => {
        this.loginService.saveCredentials(credentials);
        this.router.navigate(['/admin']);
      },
      error => {
        console.error(error);
      }
      );
  }

}
