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
  cours: any = [];
  notification = inject(NotificationService);
  authService = inject(AuthService);

  /* ---------- INIT ---------- */
  ngOnInit() {
    this.raffraichirCours();
  }

  /* ---------- CHARGER LA LISTE ---------- */
  raffraichirCours() {
    this.http
      .get('http://localhost:5000/cours/liste')
      .subscribe(cours => this.cours = cours);
  }

  /* ---------- SUPPRIMER UN COURS ---------- */
  onClickSuppressionCours(item: any) {
    if (confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      this.http
        .delete('http://localhost:5000/cours/' + item.id_cours)
        .subscribe(() => {
          this.raffraichirCours();
          this.notification.show('Le cours a bien été supprimé', 'valid');
        });
    }
  }

  /* ---------- RÉSERVER UN COURS ---------- */
onClickReserver(item: any) {
  this.http.post(
      'http://localhost:5000/reservations',
      { id_cours: item.id_cours },
      { responseType: 'text' }           // ←  important
  ).subscribe({
    next: ()  => this.notification.show('Réservation confirmée', 'valid'),
    error: err => {
      if (err.status === 409) {
        this.notification.show('Ce chien est déjà inscrit à ce cours', 'error');
      } else {
        this.notification.show('Impossible de réserver', 'error');
      }
    }
  });
}
}
