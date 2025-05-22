/*
app.config.ts on koko sovelluksen konfiguraatiotiedosto, jossa otetaan käyttöön, eli
tarjotaan koko sovellukselle (provide) esim. reititys ja in-memory-web-api. Modulaarisessa
sovelluksessa nämä määritykset voivat olla myös päämoduulissa ja reittimoduulissa.
*/
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


export const appConfig: ApplicationConfig = {
  // providers-taulukko sisältää sovellukselle tarjottavat palvelut
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    // Firebase configuration
    provideFirebaseApp(() => initializeApp({ 
      projectId: "ang-firebook-pelti", 
      appId: "1:693770805211:web:cf456315cb151c625b51fe", 
      storageBucket: "ang-firebook-pelti.firebasestorage.app", 
      apiKey: "AIzaSyDSE2s8wlKwxbQzqhRPuHzs_DZkugNJisY", 
      authDomain: "ang-firebook-pelti.firebaseapp.com", 
      messagingSenderId: "693770805211" 
    })),
    provideFirestore(() => getFirestore())
  ]
};
