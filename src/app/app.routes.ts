import { Routes } from '@angular/router';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { ContactnewComponent } from './contactnew/contactnew.component';
import { ContacteditComponent } from './contactedit/contactedit.component';
// tähän määritellään sovellusken reitit eli mikä url-polku
// vastaa mitäkin komponenttia
export const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full'}, // uudelleenohjaus juuresta
  { path: 'list', component: ContactlistComponent},
  { path: 'new', component: ContactnewComponent},
  { path: 'edit', component: ContacteditComponent},
];
