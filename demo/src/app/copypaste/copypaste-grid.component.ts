import {Component} from "@angular/core";

import {RangeSelectListener} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "copy-paste-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Copy Paste Demo</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Cells can be selected as a 2d array and the data copied.  Columns will be delimited with a \t and rows will be
          delimited with \n.  Similarly, pasted data will be parsed with \n and then with \t.  This is how spreadsheet tools
          such as Excel expect data when copy/pasting multiple cells.<br />
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="configTemplate" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #configTemplate>
            <pre>
              &lt;hci-grid
                [title]="'Copy Paste Grid'"
                [data]="data"
                [columns]="columns"
                [eventListeners]="listeners"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "nLabs", name: "# Labs"
              field: "path.nPath", name: "# Path"
            </pre>
          </ng-template>
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="dataTemplate" popoverTitle="Bound Data" placement="right">Show Bound Data</button>
          <ng-template #dataTemplate>
            <div class="d-flex flex-nowrap" style="font-weight: bold;">
              <span style="width: 100px;">idPatient</span>
              <span style="width: 100px;">firstName</span>
              <span style="width: 100px;">lastName</span>
              <span style="width: 200px;">dob</span>
              <span style="width: 100px;">nLabs</span>
              <span style="width: 200px;">nPathLabs</span>
            </div>
            <div *ngFor="let row of copyPasteData" class="d-flex flex-nowrap">
              <span style="width: 100px;">{{row.idPatient}}</span>
              <span style="width: 100px;">{{row.firstName}}</span>
              <span style="width: 100px;">{{row.lastName}}</span>
              <span style="width: 200px;">{{row.dob}}</span>
              <span style="width: 100px;">{{row.nLabs}}</span>
              <span style="width: 200px;">{{row.nPathLabs}}</span>
            </div>
          </ng-template>
        </div>
        <div class="card-text">
          <span style="font-size: larger; font-weight: bold;">To copy</span>
          <ul>
            <li>Press on a cell and drag the mouse over a range of cells and release.</li>
            <li>Use ctrl-c to copy those cell data</li>
            <li>In Excel select cell and ctrl-v</li>
          </ul>
        </div>
        <div class="card-text">
          <span style="font-size: larger; font-weight: bold;">To paste</span>
          <ul>
            <li>In Excel ctrl-c an array of cells</li>
            <li>Select a range of cells and ctrl-v</li>
            <li>Look at cell data and bound data change</li>
          </ul>
        </div>
        <p>
          <hci-grid [title]="'Copy Paste Grid'"
                    [data]="data"
                    [columns]="columns"
                    [eventListeners]="listeners">
          </hci-grid>
        </p>
      </div>
    </div>
  `,
  host: {class: "outlet-column"}
})
export class CopyPasteGridComponent {

  data: Object[];

  columns: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "nLabs", name: "# Labs" },
    { field: "path.nPath", name: "# Path" }
  ];

  listeners: any[] = [
    {type: RangeSelectListener}
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {
    this.data = this.dataGeneratorService.getData(6);
  }

}
