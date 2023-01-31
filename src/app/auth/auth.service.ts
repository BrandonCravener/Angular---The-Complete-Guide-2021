import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthRespData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiKey = "AIzaSyB8cQ6BAqoNmM8Tz07ApX-BvDaLIBEbRb8"

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthRespData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    })
  }
}
