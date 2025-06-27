import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-accueil',
  imports: [MatCardModule, MatButtonModule, DatePipe, RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
})
export class AccueilComponent {
  http = inject(HttpClient);
  produits: any = [];
  notification = inject(NotificationService);
  authService = inject(AuthService);

  ngOnInit() {
    this.raffraichirProduit();
  }

  raffraichirProduit() {
    this.http
      .get('http://localhost:5000/utilisateurs/liste')
      .subscribe((produits) => (this.produits = produits));
  }

  onClickSuppressionUtilisateur(item: any) {
    if (confirm('Voulez-vous vraiment supprimer cette utilisateur ?')) {
      this.http
        .delete('http://localhost:5000/utilisateur/' + item.id)
        .subscribe((reponse) => {
          this.raffraichirProduit();
          this.notification.show('Lutilisateur a bien été supprimé', 'valid');
        });
    }
  }
}
