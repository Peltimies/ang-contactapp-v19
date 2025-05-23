import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.signOut()
      .then(() => {
        console.log('Käyttäjä kirjautui ulos onnistuneesti');
      })
      .catch(error => {
        console.error('Uloskirjautumisessa tapahtui virhe:', error);
      });
  }
}
