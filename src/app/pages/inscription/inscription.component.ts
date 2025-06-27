import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-inscription',
  imports: [MatButtonModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss',
})
export class InscriptionComponent {
  formBuilder = inject(FormBuilder);
  http = inject(HttpClient);
  notification = inject(NotificationService);
  router = inject(Router);


  formulaire = this.formBuilder.group({
    nom: [""],
    prenom: [""],
    nom_utilisateur: [""],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onInscription() {
    if (this.formulaire.valid) {
      this.http
        .post('http://localhost:5000/inscription', this.formulaire.value)
        .subscribe({
          next: (resultat) => {
            this.notification.show('Vous êtes inscrit, vous pouvez vous connecter', 'valid');
            this.router.navigateByUrl("/connexion")
          },
          error: (erreur) => {
            if (erreur.status === 409) {
              this.notification.show('Cet email est déjà utilisé', 'error');
            }
          },
        });
    }
  }
}
