/*
app.config.ts on koko sovelluksen konfiguraatiotiedosto, jossa otetaan käyttöön, eli
tarjotaan koko sovellukselle (provide) esim. reititys ja in-memory-web-api. Modulaarisessa
sovelluksessa nämä määritykset voivat olla myös päämoduulissa ja reittimoduulissa.
*/
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { InMemoryDataService } from './in-memory-data.service';

export const appConfig: ApplicationConfig = {
  // providers-taulukko sisältää sovellukselle tarjottavat palvelut
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    // Tämä rivi poistetaan kun ryhdytään käyttämään oikeaa API:a.
    importProvidersFrom(InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 })),  
  ]
};
