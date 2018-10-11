import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'batch'
})
export class BatchPipe implements PipeTransform {

  transform(arr: [object], size: number): any {
    const batch = [];

    for (let i = 0; i < arr.length; i += size) {
      batch.push(arr.slice(i, i + size));
    }

    return batch;
  }

}
