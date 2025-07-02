import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export const vendeurGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  if (
    authService.user?.role == 'coach' ||
    authService.user?.role == 'admin'
  ) {
    return true;
  }

  notification.show(
    "Vous n'avez pas accès à cette page, connectez vous en tant que coach",
    'error'
  );
  return router.parseUrl('/connexion');
};
