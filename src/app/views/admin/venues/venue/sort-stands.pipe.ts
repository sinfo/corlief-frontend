import { Pipe, PipeTransform } from '@angular/core';
import { Stand } from './stand';

@Pipe({
  name: 'sortStands'
})
export class SortStandsPipe implements PipeTransform {

  transform(stands: Stand[], args?: any): Stand[] {
    return stands.sort(Stand.compare);
  }

}
