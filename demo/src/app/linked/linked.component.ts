import {Component} from "@angular/core";

import {DataGeneratorService} from "../services/data-generator.service";
import {TextFilterRenderer} from "hci-ng-grid";

@Component({
  selector: "linked-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Linked Grids</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          TODO
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config0" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config0>
            <pre>
              
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data1"
                    [configurable]="true"
                    [columnDefinitions]="columns1"
                    [linkedGroups]="['groupA']"
                    [pageSize]="5"
                    [pageSizes]="[5, 10, 25]">
          </hci-grid>
        </p>
        <p>
          <hci-grid [data]="data2"
                    [configurable]="true"
                    [columnDefinitions]="columns2"
                    [linkedGroups]="['groupA']"
                    [pageSize]="5"
                    [pageSizes]="[5, 10, 25]">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class LinkedDemoComponent {

  data1: any[];
  columns1: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "nLabs", name: "# Labs", dataType: "number" },
  ];

  data2: any[];
  columns2: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "nLabs", name: "# Labs", dataType: "number" },
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data1 = this.dataGeneratorService.getData(57);
    this.data2 = this.dataGeneratorService.getData(33);
  }

}
