import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

    user!: User | null; //Firebasesta saatava käyttäjäolio

  constructor(private auth: Auth) {}
  /* Sign up
  Rekisteröityminen eli jos käyttäjää ei ole, luodaan uusi
  käyttäjä. Kun homma onnistuu, haetaan käyttäjäolio,
  jonka avulla päästään käyttöliittymän salaiseen osaan. 
  */
  signUp(email: string, password: string) {
     return createUserWithEmailAndPassword(this.auth, email, password)
      .then(res => {
        console.log('Successfully signed up!', res);
        this.user = res.user;
        return res; // Palautetaan vastaus, jotta promise-ketjua voidaan jatkaa
      });
  }

  /* Sign in
  Rekisteröitynyt käyttäjä kirjautuu sisään. Kun homma onnistuu, 
  haetaan käyttäjäolio, jonka avulla päästään käyttöliittymän 
  salaiseen osaan.
  */
  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
    .then(res => {
      console.log('Successfully signed in!', res);
      this.user = res.user;
      return res; // Palautetaan vastaus, jotta promise-ketjua voidaan jatkaa
    });
  }

  /* Sign out */
  signOut() {
    return signOut(this.auth);
  }

}
