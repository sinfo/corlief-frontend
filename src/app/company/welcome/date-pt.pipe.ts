import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePt'
})
export class DatePtPipe implements PipeTransform {

  private translator = [
    'janeiro', 'fevereiro', 'março', 'abril',
    'maio', 'junho', 'julho', 'agosto',
    'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  transform(start: Date, end?: Date): string {
    const startDay = start.getDate();
    const startMonth = this.translator[start.getMonth()];

    if (end === undefined) {
      return `${startDay} de ${startMonth}`;
    }

    const endDay = end.getDate();
    const endMonth = this.translator[end.getMonth()];

    return start.getMonth() === end.getMonth()
      ? `${startDay} a ${endDay} de ${startMonth}`
      : `${startDay} de ${startMonth} a ${endDay} de ${endMonth}`;
  }

}
