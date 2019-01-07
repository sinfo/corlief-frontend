import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateEn'
})
export class DateEnPipe implements PipeTransform {

  private translator = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  transform(start: Date, end?: Date): string {
    const startDay = start.getDate();
    const startMonth = this.translator[start.getMonth()];

    var startTerm
    if(startDay === 1 || startDay === 21 || startDay === 31){
        startTerm = "st";
    }
    else if (startDay === 2 || startDay === 22){
        startTerm = "nd"
    }
    else if(startDay === 3 || startDay === 23){
        startTerm = "rd"
    }
    else{
        startTerm = "th"
    }

    if (end === undefined) {
      return `${startMonth} ${startDay}${startTerm} `;
    }

    const endDate = new Date(start.getTime() + end.getTime());

    const endDay = endDate.getDate();
    const endMonth = this.translator[endDate.getMonth()];

    var endTerm
    if(endDay === 1 || endDay === 21 || endDay === 31){
        endTerm = "st";
    }
    else if (endDay === 2 || endDay === 22){
        endTerm = "nd"
    }
    else if(endDay === 3 || endDay === 23){
        endTerm = "rd"
    }
    else{
        endTerm = "th"
    }

    return start.getMonth() === end.getMonth()
      ? `${startMonth} ${startDay}${startTerm} to ${endDay}${endTerm}`
      : `${startMonth} ${startDay}${startTerm} to ${endMonth} ${endDay}${endTerm}`;
  }

}
