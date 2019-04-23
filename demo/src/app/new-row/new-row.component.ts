import {Component} from "@angular/core";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "new-row-demo",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>New Row</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Add a new row of data to the grid.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [data]="data"
                [columns]="columns"
                [pageSize]="10"
                [pageSizes]="[10, 25, 100]&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
            </pre>
          </ng-template>
        </div>
        <div>
          <hci-grid [title]="'New Row'"
                    [data]="data"
                    [columns]="columns"
                    [mode]="'spreadsheet'"
                    [pageSize]="10"
                    [pageSizes]="[10, 25, 100]">
          </hci-grid>
        </div>
      </div>
    </div>
  `,
  host: {class: "outlet-column"}
})
export class NewRowDemo {

  data: Object[];
  columns: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name" },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "address", name: "Address" }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data = this.dataGeneratorService.getData(13);
  }
}
