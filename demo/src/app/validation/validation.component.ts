import {Component} from "@angular/core";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "validation-demo",
  template: `
    <div class="card-group flex-column">
      <div class="card m-3">
        <div class="card-header">
          <h4>Validation</h4>
        </div>
        <div class="card-body">
          <div class="card-text">
            Open the config to see the validation options on different columns.  Then edit a few columns.  Invalid changes
            are not saved.
          </div>
          <div class="card-text">
            <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
            <ng-template #config1>
              <pre>
                &lt;hci-grid
                  [title]="'Validation Grid'"
                  [data]="data"
                  [columns]="columns"
                  [pageSize]="10"
                  [nVisibleRows]="10"&gt;
                &lt;/hci-grid&gt;
                
                Columns:
                field: "idPatient", name: "ID", visible: true
                field: "lastName", name: "Last Name", editConfig: required: true
                field: "firstName", name: "First Name", editConfig: maxlength: 35
                field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY"
                field: "nLabs", name: "# Labs", editConfig: pattern: /^[0-9]1$/
                field: "path.nPath", name: "# Lab Path", editConfig: pattern: /^[0-9]1,2$/
              </pre>
            </ng-template>
            <button type="button" class="btn btn-outline-primary" [ngbPopover]="data1" popoverTitle="Bound Data" placement="right">Show Bound Data</button>
            <ng-template #data1>
              <div class="d-flex flex-nowrap" style="font-weight: bold;">
                <span style="width: 100px;">idPatient</span>
                <span style="width: 100px;">firstName</span>
                <span style="width: 100px;">lastName</span>
                <span style="width: 200px;">dob</span>
                <span style="width: 100px;">nLabs</span>
                <span style="width: 200px;">nPathLabs</span>
              </div>
              <div *ngFor="let row of editData" class="d-flex flex-nowrap">
                <span style="width: 100px;">{{row.idPatient}}</span>
                <span style="width: 100px;">{{row.firstName}}</span>
                <span style="width: 100px;">{{row.lastName}}</span>
                <span style="width: 200px;">{{row.dob}}</span>
                <span style="width: 100px;">{{row.nLabs}}</span>
                <span style="width: 200px;">{{row.path.nPath}}</span>
              </div>
            </ng-template>
          </div>
          <div>
            <hci-grid [title]="'Validation Grid'"
                      [data]="data"
                      [columns]="columns"
                      [mode]="'spreadsheet'"
                      [pageSize]="10"
                      [nVisibleRows]="10">
            </hci-grid>
          </div>
        </div>
      </div>
    </div>
  `,
  host: {class: "outlet-column"}
})
export class ValidationComponent {

  data: Object[];

  columns: any[] = [
    { field: "idPatient", name: "ID", visible: true },
    { field: "lastName", name: "Last Name", editConfig: {required: true} },
    { field: "firstName", name: "First Name", editConfig: {maxlength: 35} },
    { field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" },
    { field: "nLabs", name: "# Labs", editConfig: {pattern: /^[0-9]{1}$/} },
    { field: "path.nPath", name: "# Lab Path", editConfig: {pattern: /^[0-9]{1,2}$/} }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data = this.dataGeneratorService.getData(15);
  }

}
