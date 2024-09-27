import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../contact';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contactedit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contactedit.component.html',
  styleUrls: ['./contactedit.component.css']
})
export class ContacteditComponent implements OnInit {

  // Propertyjen alustukset tehdään tässä esittelyn yhteydessä
  contacts: Contact[] = []; // komponentin kontaktitaulukko
  editmode: boolean = false; // muokkauslomake oletuksena ei näkyvissä
  name = '';
  email = '';
  id: number = 0;
  // Service otetaan käyttöön komponentin konstruktorin argumenttina (Dependency injection)
  constructor(private contactService: ContactService) {
  }

  // tilataan subscribe-metodilla observable servicen getContacts -metodista
  // subscriben argumenttina on callback jolla kontaktitaulukko saadaan
  getContacts(): void {
    this.contactService.getContacts()
      .subscribe(contacts => this.contacts = contacts);
  }

  ngOnInit() {
    this.getContacts(); // suoritetaan aina kun komponentti alustetaan
  }

  // Lomakkeelta saadut tiedot contactServicen updateContact-metodille
  onSubmit(formData: any) {
    this.contactService.updateContact({
      'id': formData.id,
      'name': formData.name,
      'email': formData.email,
    // päivitetyt kontaktit haetaan uudestaan, mutta esim. map-metodilla
    // voisi myös päivittää käyttöliittymän ilman hakua serveriltä
    }).subscribe(() => this.getContacts());
    // tyhjennetään lomakkeen kentät kun päivitys on suoritettu
    this.name = '';
    this.email = '';
    this.id = 0;
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

