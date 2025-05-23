import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  loginEmail!: string;
  loginPassword!: string;
  // Kirjautumiseen liittyvät propertyt
  isLoggedIn = false;
  loginError = '';
  showLoginForm = true; // Näytetään kirjautumislomake oletuksena
  
  // Rekisteröitymiseen liittyvät propertyt
  signupEmail = '';
  signupPassword = '';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Tarkistetaan onko käyttäjä jo kirjautunut ja asetetaan kirjautumistila
    this.checkLoginStatus();
  }

  // Tarkistaa kirjautumistilan
  checkLoginStatus() {
    console.log('Checking login status, auth user:', this.authService.user);
    if (this.authService.user) {
      console.log('User is logged in');
      this.isLoggedIn = true;
      this.showLoginForm = false;
    } else {
      console.log('User is not logged in');
      this.isLoggedIn = false;
      this.showLoginForm = true;
    }
  }

  // käyttöliittymän autentikaatioon liittyvien nappien metodit
  signUp() {
    this.authService.signUp(this.loginEmail, this.loginPassword);
    this.loginEmail = '';
    this.loginPassword = '';
  }

  signIn() {
    this.authService.signIn(this.loginEmail, this.loginPassword);
    this.loginEmail = '';
    this.loginPassword = '';
  }

  signOut() {
    this.authService.signOut().then(() => {
      this.authService.user = null;
      this.isLoggedIn = false;
      this.showLoginForm = true;
    })
    .catch((e) => console.log(e.message));
  }
}
