import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginRequest } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fakeUsers = [
    { username: 'admin', password: 'admin' }
  ];
  private authLoginSubject = new BehaviorSubject<LoginRequest | null>(null);
  public authLogin = this.authLoginSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('authLogin');
    if (storedUser) {
      this.authLoginSubject.next(JSON.parse(storedUser) as LoginRequest);
    }
  }

  login(username: string, password: string): boolean {
    const user = this.fakeUsers.find(u => u.username === username && u.password === password);
    if (user) {
      const loginRequest: LoginRequest = { username, password };
      this.authLoginSubject.next(loginRequest);
      localStorage.setItem('authLogin', JSON.stringify(loginRequest));
      return true;
    }
    return false;
  }

  logout(): void {
    this.authLoginSubject.next(null);
    localStorage.removeItem('authLogin');
  }

  isLoggedIn(): boolean {
    return this.authLoginSubject.value !== null;
  }
}
