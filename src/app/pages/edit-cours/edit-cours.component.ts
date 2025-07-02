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
  selector: 'app-edit-cours',
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-cours.component.html',
  styleUrl: './edit-cours.component.scss',
})
export class EditCoursComponent {

  formBuilder = inject(FormBuilder);
  http = inject(HttpClient);
  notification = inject(NotificationService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

formulaire = this.formBuilder.group({
  nom: ['', [Validators.required, Validators.maxLength(20)]],
  duree_cours: [null, [Validators.required, Validators.min(1)]], 
  nom_type: ['', [Validators.maxLength(50)]],
});

  coursEdite: any;

  ngOnInit() {
    this.activatedRoute.params.subscribe((parametres) => {
     
      if (parametres['id']) {
        //on recupère le cours via son id
        console.log(this.formulaire.value); // 

        this.http
          .get('http://localhost:5000/cours/' + parametres['id'])
          .subscribe((cours) => {
            //on hydrate les champs du formulaire avec le cours retourné
            console.log(cours);
            this.formulaire.patchValue(cours);
            this.coursEdite = cours;
          });
      }
    });
  }

  onAjoutCours() {
    if (this.formulaire.valid) {
      if (this.coursEdite) {
        //on modifie le cours

        this.http
          .put(
            'http://localhost:5000/cours/' + this.coursEdite.id_cours,
            this.formulaire.value
          )
          .subscribe({
            next: (reponse) => {
              this.notification.show('Le cours a bien été modifié', 'valid');
              this.router.navigateByUrl('/accueil');
            },
            error: (erreur) => {
              if (erreur.status === 409) {
                this.notification.show('Un cours porte déjà ce nom', 'error');
              }
            },
          });
      } else {
        //on ajoute le cours

        this.http
          .post('http://localhost:5000/cours', this.formulaire.value)
          .subscribe({
            next: (reponse) => {
              this.notification.show('Le cours a bien été ajouté', 'valid');
              this.router.navigateByUrl('/accueil');
            },
            error: (erreur) => {
              if (erreur.status === 409) {
                this.notification.show('Un cours porte déjà ce nom', 'error');
              }
            },
          });
      }
    }
  }
}
