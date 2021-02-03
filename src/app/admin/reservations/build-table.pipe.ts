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
    }
    const k = availability.venue[activity].map(ac => {
      const result = {
        id: ac.id,
        day: ac.day
      } as {
        id: number,
        day: number,
        free: boolean,
        company?: Company
      };


      const s = availability.availability[ac.day - 1][activity].find(act => act.id === ac.id);
      if (s) {
        result.free = s.free;
        result.company = s.company;
      }

      return result;
    });

    return k;
  }

}
