import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.html',
})
export class FormField {
  label = input.required<string>();
  required = input(false);
}
