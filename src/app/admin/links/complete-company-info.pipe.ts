import { Pipe, PipeTransform } from '@angular/core';

import { Company, Participation } from './link/company';

@Pipe({
  name: 'completeCompanyInfo'
})
export class CompleteCompanyInfoPipe implements PipeTransform {

  transform(simple: [Company], complete: [Company], edition?: String): [Company] {
    const ids: String[] = complete.map(company => company.id);

    return <[Company]>simple.map((company: Company) => {
      const index = ids.indexOf(company.id);

      if (index === -1) { return null; }

      const result = complete[index];

      if (edition === undefined) { return result; }

      const participation = Participation.getFromEdition(complete[index].participations, edition);

      if (participation) {
        result.currentParticipation = participation;
      }

      return result;
    });
  }

}
