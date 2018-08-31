import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  private SESSION_NAME = 'corlief';
  private internalStorage = {};

  constructor() { }

  setItem(key: string, value: object): void {
    try {
      sessionStorage.setItem(`${this.SESSION_NAME}_${key}`, JSON.stringify(value));
    } catch (err) {
      this.internalStorage[key] = value;
    }
  }

  getItem(key: string): object {
    try {
      if (sessionStorage.getItem(`${this.SESSION_NAME}_${key}`) === null) {
        this.removeItem(key);
        return null;
      }
      return JSON.parse(sessionStorage.getItem(`${this.SESSION_NAME}_${key}`));
    } catch (err) {
      return this.internalStorage[key];
    }
  }

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(`${this.SESSION_NAME}_${key}`);
      delete this.internalStorage[key];
    } catch (err) {
      console.error(err);
    }
  }

  clear(): void {
    try {
      sessionStorage.clear();
      this.internalStorage = {};
    } catch (err) {
      console.error(err);
    }
  }
}
