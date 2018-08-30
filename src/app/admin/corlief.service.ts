import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CorliefService {
  user: String;
  token: String;

  constructor() { }

  login(user: String, token: String) {

  }

  logout() {
    this.user = undefined;
    this.token = undefined;
  }

  isLoggedIn(): boolean {
    return this.user !== undefined && this.token !== undefined;
  }
}
