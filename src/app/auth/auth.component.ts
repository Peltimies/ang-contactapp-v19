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
  
  // Tilaviestit käyttäjälle
  statusMessage = '';
  messageType = ''; // 'success' tai 'error'
  showStatusMessage = false;
  isLoading = false; // Näytetään latausanimaatio toimintojen aikana

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
    if (!this.loginEmail || !this.loginPassword) {
      this.showMessage('Sähköposti ja salasana ovat pakollisia', 'error');
      return;
    }
    
    this.isLoading = true;
    this.showStatusMessage = false;
    
    this.authService.signUp(this.loginEmail, this.loginPassword)
      .then(res => {
        // Onnistunut rekisteröityminen
        this.showMessage('Rekisteröityminen onnistui! Olet nyt kirjautunut sisään.', 'success');
        this.checkLoginStatus(); // Päivitetään kirjautumistila
      })
      .catch(error => {
        // Rekisteröitymisvirhe
        let errorMessage = 'Rekisteröityminen epäonnistui';
        
        // Käsitellään yleisimmät virheet
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'Sähköpostiosoite on jo käytössä';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Virheellinen sähköpostiosoite';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Salasana on liian heikko (min. 6 merkkiä)';
        }
        
        this.showMessage(errorMessage, 'error');
      })
      .finally(() => {
        this.isLoading = false;
        this.loginEmail = '';
        this.loginPassword = '';
      });
  }

  signIn() {
    if (!this.loginEmail || !this.loginPassword) {
      this.showMessage('Sähköposti ja salasana ovat pakollisia', 'error');
      return;
    }
    
    this.isLoading = true;
    this.showStatusMessage = false;
    
    this.authService.signIn(this.loginEmail, this.loginPassword)
      .then(res => {
        // Onnistunut kirjautuminen
        this.showMessage('Kirjautuminen onnistui!', 'success');
        this.checkLoginStatus(); // Päivitetään kirjautumistila
      })
      .catch(error => {
        // Kirjautumisvirhe
        let errorMessage = 'Kirjautuminen epäonnistui';
        
        // Käsitellään yleisimmät virheet
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          errorMessage = 'Virheellinen sähköpostiosoite tai salasana';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Virheellinen sähköpostiosoite';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Liian monta kirjautumisyritystä, yritä myöhemmin uudelleen';
        }
        
        this.showMessage(errorMessage, 'error');
      })
      .finally(() => {
        this.isLoading = false;
        this.loginEmail = '';
        this.loginPassword = '';
      });
  }

  signOut() {
    this.isLoading = true;
    
    this.authService.signOut()
      .then(() => {
        this.authService.user = null;
        this.isLoggedIn = false;
        this.showLoginForm = true;
        this.showMessage('Olet kirjautunut ulos', 'success');
      })
      .catch((error) => {
        console.log(error.message);
        this.showMessage('Uloskirjautuminen epäonnistui', 'error');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  
  // Näyttää tilaviestin käyttäjälle
  showMessage(message: string, type: 'success' | 'error') {
    this.statusMessage = message;
    this.messageType = type;
    this.showStatusMessage = true;
    
    // Piilotetaan viesti automaattisesti 5 sekunnin kuluttua, jos se on onnistumisviesti
    if (type === 'success') {
      setTimeout(() => {
        this.showStatusMessage = false;
      }, 5000);
    }
  }
}
