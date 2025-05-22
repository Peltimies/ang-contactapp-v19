/* Service on Angular-sovelluksen rakenneosa jonka tarkoituksena on tarjota
palveluita muille rakenneosille, yleensä komponenteille. Tämä
service välittää dataa palvelimelta Angular-sovellukseen ja toisinpäin.
*/
import { Injectable } from '@angular/core';
import { Contact } from './contact';
/* Palvelimelta haettu data toimitetaan komponentille observablena
   Angular on reaktiivinen sovelluskehys joka käyttää observableja
   datan siirtämiseen paikasta toiseen. */
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Firestore, addDoc, collection, collectionData,
  doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc
} from '@angular/fire/firestore';

/* injectable annotaatio kertoo että service voidaan injektoida komponenttiin.
 providedIn: 'root' argumenttina tekee servicestä providerin */
@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private firestore: Firestore) { }

  // Haetaan kaikki kontaktit Firestoresta
  getContacts(): Observable<Contact[]> {
    const contactsRef = collection(this.firestore, 'contacts');
    return collectionData(contactsRef, { idField: 'id' }) as Observable<Contact[]>;
  }

  // Lisätään uusi kontakti Firestoreen
  postContactToServer(newcontact: Contact): Observable<Contact> {
    const contactsRef = collection(this.firestore, 'contacts');
    return from(addDoc(contactsRef, newcontact)).pipe(
      map(docRef => {
        // Spread the newcontact first, then override the id property
        return { ...newcontact, id: docRef.id } as Contact;
      })
    );
  }

  // Päivitetään kontakti id:n perusteella
  updateContact(c: any): Observable<Contact> {
    const contactRef = doc(this.firestore, `contacts/${c.id}`);
    return from(updateDoc(contactRef, { name: c.name, email: c.email })).pipe(
      map(() => c as Contact)
    );
  }

  // Poistetaan kontakti id:n perusteella
  removeContact(id: number | string): Observable<any> {
    const contactRef = doc(this.firestore, `contacts/${id}`);
    return from(deleteDoc(contactRef));
  }
}
