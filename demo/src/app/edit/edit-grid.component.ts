import {Component, HostBinding} from "@angular/core";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "edit-grid",
  template: `
    <div class="card-group flex-column">
      <div class="card m-3">
        <div class="card-header">
          <h4>Edit Grid</h4>
        </div>
        <div class="card-body">
          <div class="card-text">
            Click on a cell<br />
            &lt;tab&gt; through cells<br />
            click on cells<br />
            up/down/left/right on selected cell<br />
            modify input cell values and check bound data changes<br />
          </div>
          <div class="card-text">
            <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
            <ng-template #config1>
              <pre>
                &lt;hci-grid
                  [title]="'Spreadsheet Grid'"
                  [data]="data1"
                  [columns]="columns1"
                  [pageSize]="25"
                  [nVisibleRows]="10"&gt;
                &lt;/hci-grid&gt;
                
                Columns:
                field: "idPatient", name: "ID", visible: true
                field: "lastName", name: "Last Name"
                field: "firstName", name: "First Name"
                field: "dob", name: "Date of Birth", dataType: "date"
                field: "nLabs", name: "# Labs"
                field: "nLabPath", name: "# Lab Path"
              </pre>
            </ng-template>
            <button type="button" class="btn btn-outline-primary" [ngbPopover]="dataConfig1" popoverTitle="Bound Data" placement="right">Show Bound Data</button>
            <ng-template #dataConfig1>
              <div class="d-flex flex-nowrap" style="font-weight: bold;">
                <span style="width: 100px;">idPatient</span>
                <span style="width: 100px;">firstName</span>
                <span style="width: 100px;">lastName</span>
                <span style="width: 200px;">dob</span>
                <span style="width: 100px;">nLabs</span>
                <span style="width: 200px;">nPathLabs</span>
              </div>
              <div *ngFor="let row of data1" class="d-flex flex-nowrap">
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
            <hci-grid [title]="'Spreadsheet Grid'"
                      [data]="data1"
                      [columns]="columns1"
                      [mode]="'spreadsheet'"
                      [pageSize]="25"
                      [nVisibleRows]="10">
            </hci-grid>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EditGridComponent {

  @HostBinding("class") classList: string = "demo-component";

  data1: Object[];

  columns1: any[] = [
    { field: "idPatient", name: "ID", visible: true },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "nLabs", name: "# Labs" },
    { field: "path.nPath", name: "# Path" }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data1 = this.dataGeneratorService.getData(13);
  }

}
