import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ptDate'
})
export class PtDatePipe implements PipeTransform {

  private translator = [
    'Jan.', 'Fev.', 'Mar.', 'Abr.',
    'Maio', 'Jun.', 'Jul.', 'Ago.',
    'Set.', 'Out.', 'Nov.', 'Dez.'
  ];

  transform(date: Date): string {
    const day = date.getUTCDate();
    const month = this.translator[date.getMonth()];

    return `${day} de ${month}`;
  }
}
