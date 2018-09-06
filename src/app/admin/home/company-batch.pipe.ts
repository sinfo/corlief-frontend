import { Pipe, PipeTransform } from '@angular/core';

import { Company } from '../links/link/company';

@Pipe({
  name: 'companyBatch'
})
export class CompanyBatchPipe implements PipeTransform {

  transform(companies: [Company], size: number): any {
    const batch = [] as [[Company]];

    for (let i = 0; i < companies.length; i += size) {
      batch.push(<[Company]>companies.slice(i, i + size));
    }

    return batch;
  }

}
