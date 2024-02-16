import { Component } from "@angular/core";

import { Info } from "../../admin/infos/info";

@Component({
  selector: "company-infos",
  templateUrl: "./company-infos.component.html",
  styleUrls: ["./company-infos.component.css"],
})
export class CompanyInfosComponent {

  maxPeopleStand = 3;
  maxCars = 3;

  peopleStandOptions = Array.from({length:this.maxPeopleStand},(_,k)=>k+1);
  
  model = new Info();

  submitted = false;

  onSubmit() {
    this.submitted = true;
  }

  newCompanyInfo() {
    this.model = new Info();
  }
}
