import { Pipe, PipeTransform } from '@angular/core';

import { Event } from 'src/app/deck/event';

@Pipe({
  name: 'getArrayOfParticipationDays'
})
export class GetArrayOfParticipationDaysPipe implements PipeTransform {

  transform(event: Event): number[] {
    const duration = event.getDuration();
    const result = [] as number[];

    for (let day = 0; day <= duration; day += 1) {
      result.push(day);
    }

    return result;
  }

}
