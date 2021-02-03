import { Pipe, PipeTransform } from '@angular/core';

import { Stand } from '../../../admin/reservations/reservation/reservation';
import { Event } from 'src/app/deck/event';

@Pipe({
  name: 'standsDisplay',
  pure: false
})
export class StandsDisplayPipe implements PipeTransform {

  transform(stands: Stand[], event: Event): any {
    const duration = event.getDuration();
    const result = [];
    const date = new Date(event.date);

    for (let day = 1; day <= duration; day++) {
      const stand = stands.filter(s => s.day === day);

      if (stand.length > 0) {
        result.push({
          day: day,
          date: new Date(date.getTime()),
          id: stand[0].standId ? stand[0].standId : -1
        });
      } else {
        result.push({
          day: day,
          date: new Date(date.getTime()),
        });
      }

      date.setDate(date.getDate() + 1);
    }

    return result;
  }

}
