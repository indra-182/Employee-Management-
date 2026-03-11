import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rupiah' })
export class RupiahPipe implements PipeTransform {
  transform(value: number): string {
    return (
      'Rp. ' +
      new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    );
  }
}
