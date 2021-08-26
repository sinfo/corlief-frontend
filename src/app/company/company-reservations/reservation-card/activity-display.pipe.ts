import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Activity } from 'src/app/admin/reservations/reservation/reservation';
import { Venue } from 'src/app/admin/venues/venue/venue';
import { format } from 'url';

@Pipe({
  name: 'activityDisplay',
  pure: false
})
export class ActivityDisplayPipe implements PipeTransform {

  transform(activity: Activity, venue: Venue): any {
    const act = venue.activities.find(x => x.kind === activity.kind);
    for (const a of act.slots) {
      if (a.id === activity.id) {
        return ` Slot ${a.id + 1} on Day ${a.day} (${formatDate(a.start, 'H:mm', 'en-US')} - ${formatDate(a.end, 'H:mm', 'en-US')})`;
      }
    }
  }

}
