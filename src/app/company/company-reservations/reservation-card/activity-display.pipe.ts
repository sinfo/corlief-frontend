import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Activity } from 'src/app/admin/venues/venue/activity';
import { Venue } from 'src/app/admin/venues/venue/venue';
import { format } from 'url';

@Pipe({
  name: 'activityDisplay',
  pure: false
})
export class ActivityDisplayPipe implements PipeTransform {

  transform(activity: number, venue: Venue, kind: string): any {
    for (const a of venue[kind]) {
      if (a.id === activity) {
        return ` Slot ${a.id + 1} on Day ${a.day} (${formatDate(a.start, 'H:mm', 'en-US')} - ${formatDate(a.end, 'H:mm', 'en-US')})`;
      }
    }
  }

}
