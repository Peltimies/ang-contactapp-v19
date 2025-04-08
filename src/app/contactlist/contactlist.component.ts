// Reaktiivinen haku listasta toteutettuna signaaleilla
import {
  Component,
  computed,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../contact';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-contactlist',
  imports: [],
  templateUrl: './contactlist.component.html',
  styleUrl: './contactlist.component.css',
})

export class ContactlistComponent {

  // kontaktitaulukko signaalina
  contacts: Signal<Contact[]>;
  // hakutermi, joka on aluksi tyhjä
  searchterm: WritableSignal<string> = signal('');
  // kontaktitaulukon filtteröinti nimen perusteella
  namefilter = computed(() =>
    // taulukko saadaan signaalista metodikutsulla contacts()
    this.contacts().filter((c) =>
      c.name.toLowerCase().includes(this.searchterm().toLowerCase())
    )
  );
  // kontaktitaulukon filtteröinti emailin perusteella
  emailfilter = computed(() =>
    this.contacts().filter((c) =>
      c.email.toLowerCase().includes(this.searchterm().toLowerCase())
    )
  );
  // Hakukriteerin valintaan tarvittavat propertyt
  field: string;
  fields: string[];
  
  constructor(private contactService: ContactService) {
    this.field = 'name'; // oletushakukriteeri
    this.fields = ['name', 'email']; // kaikki hakukriteerit
    /* Haetaan kaikki kontaktit signaalina, muuttamalla palvelimelta
       tuleva observable signaaliksi. toSignal-metodi vaatii alkuarvon 
       toisena argumenttina, ja se pitää suorittaa konstruktorissa */
    this.contacts = toSignal(this.contactService.getContacts(), {
    initialValue: [] });
  }

  // Otetaan hakukriteerin arvo field-muuttujaan
  onSelect(e: Event) {
    this.field = (e.target as HTMLInputElement).value;
  }
  // Otetaan hakutermi searchterm-signaalimuuttujaan
  searchContacts(e: Event) {
    this.searchterm.set((e.target as HTMLInputElement).value);
  }
}
