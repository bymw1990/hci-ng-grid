import {Component, ViewChild} from "@angular/core";

import {Column, GridComponent, CheckRowSelectView, RowDblClickListener} from "hci-ng-grid/index";
import {ClickRowSelectListener} from "hci-ng-grid";

@Component({
  selector: "saving-demo",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Cell Saving</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          TODO
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [data]="data1"
                [columnDefinitions]="columns1"
                (onCellSave)="onCellSave($event)"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              isKey: true, field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "pcg.nLabs", name: "# Labs"
              field: "pcg.nested.nLabPath", name: "# Lab Path"
              
              Listeners:
              listeners1: Array&lt;any&gt; = [
                {{"{"}} type: RowDblClickListener {{"}"}}
              ];
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data1"
                    [columnDefinitions]="columns1"
                    (onCellSave)="onCellSave($event)">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class SavingDemoComponent {

  data1: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1970-01-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1973-01-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1972-01-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1976-01-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1973-01-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1977-01-11T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns1: Column[] = [
    new Column({ isKey: true, field: "idPatient", name: "ID", visible: false }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date" }),
    new Column({ field: "pcg.nLabs", name: "# Labs" }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path" })
  ];

  onCellSave(dataChange: any) {
    console.debug("onCellSave: " + JSON.stringify(dataChange));
  }
}
