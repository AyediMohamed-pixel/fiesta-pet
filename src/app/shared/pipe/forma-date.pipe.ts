import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,

})
export class CustomDatePipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '';

    const parts = value.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month - 1, day);

    const options :any = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('fr-FR', options);
  }

}
