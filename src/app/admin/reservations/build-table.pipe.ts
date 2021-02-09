import { Pipe, PipeTransform } from '@angular/core';
import { Availability } from 'src/app/admin/venues/venue/venue';
import { Company } from 'src/app/deck/company';

@Pipe({
  name: 'buildTable'
})
export class BuildTablePipe implements PipeTransform {

  transform(availability: Availability, activity?: string) {
    const duration = Object.keys(availability.availability).length;

    availability.availability.sort((av1, av2) => {
      return av1.day > av2.day ? 1 : 0;
    });

    if (!activity) {
      if (availability.venue.stands.length !== 0) {
        return availability.venue.stands.map(stand => {
          const result = {
            standId: stand.id,
            days: []
          };

          for (let day = 0; day < duration; day++) {
            const s = availability.availability[day].stands.filter(avStand => avStand.id === stand.id)[0];
            result.days.push({
              free: s.free,
              company: s.company
            });
          }

          return result;
        });
      } else {
        const max = availability.getMaxOccupation();
        const final = [];
        for (let i = 0; i < max; i++) {
          const result = {
            standId: i,
            days: []
          };


          for (let day = 0; day < duration; day++) {
            const s = availability.availability[day].stands.filter(avStand => avStand.id === i)[0];
            result.days.push({
              free: s ? s.free : true,
              company: s ? s.company : null
            });
          }

          final.push(result);
        }
        return final;
      }
    }

    const max = availability.getMaxActivity(activity);
    const final = [];
    for (let i = 0; i < max; i++) {
      const result = {
        row: i,
        days: []
      };


      for (let day = 0; day < duration; day++) {
        const s = availability.availability[day][activity].sort((a1, a2) => {
          return a1.start > a2.start ? 1 : (a1.end > a2.end ? 1 : 0);
        })[i];
        result.days.push({
          free: s ? s.free : true,
          company: s ? s.company : null,
          id: s ? s.id : null
        });
      }

      final.push(result);
    }
    return final;
  }

}
