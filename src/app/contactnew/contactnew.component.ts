import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Router } from '@angular/router'; // tarvitaan navigateToList() -metodia varten

import { Contact } from '../contact';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contactnew',
  imports: [FormsModule],
  templateUrl: './contactnew.component.html',
  styleUrls: ['./contactnew.component.css'],
})
export class ContactnewComponent implements OnInit {
  constructor(private contactService: ContactService, private router: Router) {}

  ngOnInit() {}

  // kontakti serverille
  onSubmit(formData: any) {
    console.log(formData);
    this.contactService
      .postContactToServer({
        name: formData.name,
        email: formData.email,
        // subscribe välttämätön jotta servicen metodi suoritetaan
        // as Contact mahdollistaa lähetyksen ilman id:tä joka generoidaan kannassa
      } as Contact)
      .subscribe(/*contact => { // näin saataisiin uusi kontakti heti tämän komponentin taulukkoon
      this.contacts.push(contact);
    }*/);
  }

  navigateToList() {
    this.router.navigate(['/']);
  }
}
