import { Injectable, signal } from '@angular/core';

export type NotificationType = 'warning' | 'danger';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly message = signal('');
  readonly type = signal<NotificationType>('warning');
  readonly visible = signal(false);

  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: NotificationType): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.message.set(message);
    this.type.set(type);
    this.visible.set(true);
    this.hideTimer = setTimeout(() => this.visible.set(false), 3000);
  }
}
