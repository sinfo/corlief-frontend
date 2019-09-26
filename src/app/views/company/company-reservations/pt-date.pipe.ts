import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ptDate'
})
export class PtDatePipe implements PipeTransform {

  private translator = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  transform(date: Date): string {
    const day = date.getDate();
    const month = this.translator[date.getMonth()];

    return `${month} ${day}`;
  }
}
