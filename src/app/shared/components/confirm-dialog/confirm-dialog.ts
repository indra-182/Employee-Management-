import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  title = input('Confirm');
  message = input('Are you sure?');
  confirmText = input('Yes');
  cancelText = input('Cancel');

  confirmed = output<void>();
  cancelled = output<void>();
}
