import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { NotificationService } from '@app/services/notifications/notifications.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
})
export class App {
  private router = inject(Router);
  protected auth = inject(AuthService);
  protected notif = inject(NotificationService);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
