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
import { getAuth, provideAuth } from '@angular/fire/auth';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  // providers-taulukko sisältää sovellukselle tarjottavat palvelut
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    // Firebase configuration
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
