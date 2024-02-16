import { Component, OnInit, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { LoginService } from 'src/app/admin/login/login.service';
import { environment } from "../../../environments/environment";
import { Router } from '@angular/router';
import { JwtService } from './jwt.service';

declare let google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private isLoggedIn = false;
  private isGoogleActive = false;

  constructor(
    private loginService: LoginService,
    private jwtService: JwtService,
    private zone: NgZone,
    private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this.loginService.isLoggedIn();

    if (this.isLoggedIn) {
      this.router.navigate(['/admin']);
    }

    this.isGoogleActive = typeof google !== "undefined" && google !== null;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.renderGoogleButton();
  }

  ngAfterViewInit() {
    this.initSocialSDKs();
  }


  initSocialSDKs() {
    google.accounts.id.initialize({
      client_id: environment.google.clientId,
      callback: this.handleGoogleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: "popup",
      hd: "sinfo.org"
    });
    this.renderGoogleButton();
  }

  private renderGoogleButton() {
    if (this.isGoogleActive) {
      google.accounts.id.renderButton(
        document.getElementById("google-button"),
        {
          theme: "outline",
          size: "medium",
          type: "standard",
          shape: "rectangular",
          text: "signin_with",
          logo_alignment: "center",
          locale: "en_US",
          width: 280
        }
      );
    }
  }

  async handleGoogleCredentialResponse(response: any) {
    let userInfo = this.jwtService.decodeToken(response.credential);

    let userId = userInfo.sub;
    let token = response.credential;
    this.loginService.login(userId, token).subscribe(
      (corliefCredentials) => {
        this.loginService.saveToken(corliefCredentials);
        this.zone.run(() =>
          this.router.navigate(['/admin'])
        );
      },
      (error) => {
        console.error(error);
        this.zone.run(() => this.router.navigate(["/login"]));
      }
    );
  }
}
