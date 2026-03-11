import { AbstractControl, ValidationErrors } from '@angular/forms';

export function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return new Date(control.value) > new Date() ? { futureDate: true } : null;
}
