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
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-produit',
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-produit.component.html',
  styleUrl: './edit-produit.component.scss',
})
export class EditProduitComponent {
  formBuilder = inject(FormBuilder);
  http = inject(HttpClient);
  notification = inject(NotificationService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  formulaire = this.formBuilder.group({
    nom: ['', [Validators.required, Validators.maxLength(20)]],
    description: ['', [Validators.maxLength(50)]],
  });

  produitEdite: any;

  ngOnInit() {
    this.activatedRoute.params.subscribe((parametres) => {
      //est on sur la page de modification ?
      if (parametres['id']) {
        //on recupère le produit via son id
        this.http
          .get('http://localhost:5000/produit/' + parametres['id'])
          .subscribe((produit) => {
            //on hydrate les champs du formulaire avec le produit retourné
            console.log(produit);
            this.formulaire.patchValue(produit);
            this.produitEdite = produit;
          });
      }
    });
  }

  onAjoutProduit() {
    if (this.formulaire.valid) {
      if (this.produitEdite) {
        //on modifie le produit

        this.http
          .put(
            'http://localhost:5000/produit/' + this.produitEdite.id,
            this.formulaire.value
          )
          .subscribe({
            next: (reponse) => {
              this.notification.show('Le produit a bien été modifié', 'valid');
              this.router.navigateByUrl('/accueil');
            },
            error: (erreur) => {
              if (erreur.status === 409) {
                this.notification.show('Un produit porte déjà ce nom', 'error');
              }
            },
          });
      } else {
        //on ajoute le produit

        this.http
          .post('http://localhost:5000/produit', this.formulaire.value)
          .subscribe({
            next: (reponse) => {
              this.notification.show('Le produit a bien été ajouté', 'valid');
              this.router.navigateByUrl('/accueil');
            },
            error: (erreur) => {
              if (erreur.status === 409) {
                this.notification.show('Un produit porte déjà ce nom', 'error');
              }
            },
          });
      }
    }
  }
}
