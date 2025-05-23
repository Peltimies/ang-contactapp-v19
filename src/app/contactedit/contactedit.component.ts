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
  loginEmail!: string;
  loginPassword!: string;
  // Kirjautumiseen liittyvät propertyt
  isLoggedIn = false;
  loginError = '';
  showLoginForm = true; // Näytetään kirjautumislomake oletuksena
  
  // Rekisteröitymiseen liittyvät propertyt
  signupEmail = '';
  signupPassword = '';

  // Propertyjen alustukset tehdään tässä esittelyn yhteydessä
  contacts: Contact[] = []; // komponentin kontaktitaulukko
  editmode: boolean = false; // muokkauslomake oletuksena ei näkyvissä
  name = '';
  email = '';
  id: string | number = ''; // Muutettu tukemaan sekä string että number -tyyppejä Firestorea varten
  
  

  // Service otetaan käyttöön komponentin konstruktorin argumenttina (Dependency injection)
  constructor(private contactService: ContactService, public authService: AuthService) {
  }


  // tilataan subscribe-metodilla observable servicen getContacts -metodista
  // subscriben argumenttina on callback jolla kontaktitaulukko saadaan
  getContacts(): void {
    this.contactService.getContacts()
      .subscribe(contacts => {
        console.log('Contacts loaded:', contacts); // Add this line
        this.contacts = contacts;
      });
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
    this.authService.signOut().then(() => this.authService.user = null)
    .catch((e) => console.log(e.message));;
  }


  // Lomakkeelta saadut tiedot joko lisätään uutena tai päivitetään olemassa olevaa
  onSubmit(formData: any) {
    const contact = {
      'name': formData.name,
      'email': formData.email
    };
    
    // Jos id on tyhjä, kyseessä on uuden kontaktin lisäys
    if (!formData.id) {
      console.log('Lisätään uusi kontakti');
      this.contactService.postContactToServer(contact as Contact)
        .subscribe(() => {
          console.log('Kontakti lisätty onnistuneesti');
          this.getContacts();
          // Tyhjennetään lomakkeen kentät
          this.resetForm();
          // Suljetaan muokkauslomake
          this.editmode = false;
        });
    } 
    // Jos id ei ole tyhjä, kyseessä on olemassa olevan kontaktin päivitys
    else {
      console.log('Päivitetään olemassa olevaa kontaktia');
      this.contactService.updateContact({
        'id': formData.id,
        'name': formData.name,
        'email': formData.email,
      }).subscribe(() => {
        console.log('Kontakti päivitetty onnistuneesti');
        this.getContacts();
        // Tyhjennetään lomakkeen kentät
        this.resetForm();
        // Suljetaan muokkauslomake
        this.editmode = false;
      });
    }
  }
  
  // Apumetodi lomakkeen kenttien tyhjentämiseen
  resetForm() {
    this.name = '';
    this.email = '';
    this.id = ''; // Resetoidaan id tyhjäksi stringiksi
  }
  /* Laitetaan muokkauslomake näkyviin ja laitetaan
     lomakkeelle arvot joita muokataan. Varsinainen muokkaus
     tapahtuu muokkauslomakkeelta laukaistavassa onSubmit-metodissa
  */ 
  edit(c: Contact) {
    console.log('Edit clicked', c); // Add this line
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

