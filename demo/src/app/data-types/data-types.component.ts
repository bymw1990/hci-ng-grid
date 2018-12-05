import {Component} from "@angular/core";

import {TextFilterRenderer} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "filter-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Choices</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          TODO
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Filter Grid'"
                    [data]="data1"
                    [columns]="columns1">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class DataTypesDemoComponent {

  data1: Object[];
  columns1: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer },
    { field: "genderDict", name: "Gender", choiceUrl: "/api/dictionary/gender", choiceValue: "value", choiceDisplay: "display" },
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data1 = this.dataGeneratorService.getData(250);
  }
}
