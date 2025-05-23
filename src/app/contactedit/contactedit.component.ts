import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../contact';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contactedit',
  imports: [FormsModule, CommonModule],
  templateUrl: './contactedit.component.html',
  styleUrls: ['./contactedit.component.css']
})
export class ContacteditComponent implements OnInit {

  // Propertyjen alustukset tehdään tässä esittelyn yhteydessä
  contacts: Contact[] = []; // komponentin kontaktitaulukko
  editmode: boolean = false; // muokkauslomake oletuksena ei näkyvissä
  name = '';
  email = '';
  id: string | number = ''; // Muutettu tukemaan sekä string että number -tyyppejä Firestorea varten
  
  // Kirjautumiseen liittyvät propertyt
  loginEmail = '';
  loginPassword = '';
  isLoggedIn = false;
  loginError = '';
  showLoginForm = true; // Näytetään kirjautumislomake oletuksena
  
  // Rekisteröitymiseen liittyvät propertyt
  signupEmail = '';
  signupPassword = '';
  signupError = '';

  // Service otetaan käyttöön komponentin konstruktorin argumenttina (Dependency injection)
  constructor(private contactService: ContactService, private authService: AuthService) {
  }


  // tilataan subscribe-metodilla observable servicen getContacts -metodista
  // subscriben argumenttina on callback jolla kontaktitaulukko saadaan
  getContacts(): void {
    this.contactService.getContacts()
      .subscribe(contacts => this.contacts = contacts);
  }

  ngOnInit() {
    console.log('ngOnInit called');
    // Tarkistetaan onko käyttäjä jo kirjautunut ja asetetaan kirjautumistila
    // Firebase tallentaa kirjautumistilan, joten edellinen kirjautuminen voi olla vielä voimassa
    // kun sovellus käynnistetään uudelleen
    this.checkLoginStatus();
  }

  // Tarkistaa kirjautumistilan
  checkLoginStatus() {
    console.log('Checking login status, auth user:', this.authService.user);
    if (this.authService.user) {
      console.log('User is logged in');
      this.isLoggedIn = true;
      this.showLoginForm = false;
      this.getContacts(); // Haetaan kontaktit vain jos käyttäjä on kirjautunut
    } else {
      console.log('User is not logged in');
      this.isLoggedIn = false;
      this.showLoginForm = true;
    }
  }

    // Kirjautuminen
    signIn() {
      this.loginError = ''; // Tyhjennetään mahdollinen aiempi virheviesti
      
      this.authService.signIn(this.loginEmail, this.loginPassword)
        .then(() => {
          this.isLoggedIn = true;
          this.showLoginForm = false;
          this.getContacts(); // Haetaan kontaktit kirjautumisen jälkeen
        })
        .catch(error => {
          this.loginError = 'Kirjautuminen epäonnistui: ' + error.message;
        });
    }
  
    // Uloskirjautuminen
    signOut() {
      console.log('Signing out');
      this.authService.signOut()
        .then(() => {
          console.log('Successfully signed out');
          // Asetetaan authService.user null-arvoksi, koska signOut() ei automaattisesti päivitä user-kenttää
          this.authService.user = null;
          this.isLoggedIn = false;
          this.showLoginForm = true;
          this.contacts = []; // Tyhjennetään kontaktilista uloskirjautumisen yhteydessä
        })
        .catch(error => {
          console.error('Error signing out:', error);
        });
    }

    // Rekisteröityminen
    signUp() {
      this.signupError = ''; // Tyhjennetään mahdollinen aiempi virheviesti
      
      this.authService.signUp(this.signupEmail, this.signupPassword)
        .then(() => {
          this.isLoggedIn = true;
          this.showLoginForm = false;
          this.getContacts(); // Haetaan kontaktit rekisteröitymisen jälkeen
        })
        .catch(error => {
          this.signupError = 'Rekisteröityminen epäonnistui: ' + error.message;
        });
    }
  

  // Lomakkeelta saadut tiedot contactServicen updateContact-metodille
  onSubmit(formData: any) {
    this.contactService.updateContact({
      'id': formData.id,
      'name': formData.name,
      'email': formData.email,
    /* Heti päivityksen jälkeen suoritetaan getContacts()-metodi
       callbackissa subscriben argumenttina. Päivittyminen tapahtuu
       tällöin välittömästi samalla sivulla */
    }).subscribe(() => this.getContacts());
    // tyhjennetään lomakkeen kentät kun päivitys on suoritettu
    this.name = '';
    this.email = '';
    this.id = ''; // Resetoidaan id tyhjäksi stringiksi Firestore-yhteensopivuuden vuoksi
  }
  /* Laitetaan muokkauslomake näkyviin ja laitetaan
     lomakkeelle arvot joita muokataan. Varsinainen muokkaus
     tapahtuu muokkauslomakkeelta laukaistavassa onSubmit-metodissa
  */ 
  edit(c: Contact) {
    this.editmode = true;
    this.name = c.name;
    this.email = c.email;
    this.id = c.id;
  }

  // poisto
  remove(c: Contact) {
    this.editmode = false;
    // console.log('Poistetaan: ' + c.id);
    // poistetaan kontakti käyttöliittymästä filter-metodilla
    this.contacts = this.contacts.filter(contact => contact !== c);
    // poistetaan kontakti kannasta servicen removeContact-metodilla 
    this.contactService.removeContact(c.id)
      .subscribe();
  }
}

