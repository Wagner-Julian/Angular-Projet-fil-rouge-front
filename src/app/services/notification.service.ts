import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  
  notification = inject(MatSnackBar);

  show(message: string, type: 'info' | 'valid' | 'error' | 'warning') {
    this.notification.open(message, '', {
      verticalPosition: 'top',
      duration: 5000,
      panelClass: type,
    });
  }
}
