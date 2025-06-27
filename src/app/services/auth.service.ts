import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;

  constructor() {
    //Quand on arrive sur l'application, et que l'utilisateur est déjà connecté
    //  on extrait les donnée du jwt stocké dans le localstorage
    const jwt = localStorage.getItem('token');

    if (jwt) {
      this.decodeJwt(jwt);
    }
  }

  decodeJwt(jwt: string) {
    localStorage.setItem('token', jwt);

    const jwtParts = jwt.split('.'); //decoupe le jwt en 3 parties
    const jwtBodyBase64 = jwtParts[1]; // recupere la partie data du jwt
    const jwtBodyDecoded = atob(jwtBodyBase64); //decode la base 64
    this.user = JSON.parse(jwtBodyDecoded); // on transforme le JSON en objet javascript
  }

  deconnexion() {
    localStorage.removeItem('token');
    this.user = null;
  }
}
