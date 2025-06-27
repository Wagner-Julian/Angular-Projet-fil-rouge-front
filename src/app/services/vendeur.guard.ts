import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export const vendeurGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  if (
    authService.user?.role == 'vendeur' ||
    authService.user?.role == 'administrateur'
  ) {
    return true;
  }

  notification.show(
    "Vous n'avez pas accès à cette page, connectez vous en tant que vendeur",
    'error'
  );
  return router.parseUrl('/connexion');
};
