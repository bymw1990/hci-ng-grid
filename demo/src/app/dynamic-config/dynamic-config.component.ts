import {Component, HostBinding, ViewChild} from "@angular/core";

import {
  CheckRowSelectView, ChoiceEditRenderer, ClickRowSelectListener, CompareFilterRenderer, TextEditRenderer,
  GridComponent, SelectFilterRenderer, TextFilterRenderer
} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "dynamic-config-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>User Config Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Sets configurable to true.  Click the cog to pull up the config dropdown and modify values.
        </div>
        <div class="card-text">
          Also, a user profile directive has been added to listen to config change output.  See the console to see the
          config output.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config0">Show Config</button>
          <mat-menu #config0="matMenu">
            <pre>
              &lt;hci-grid
                #grid1
                [data]="data1"
                [configurable]="true"
                [columns]="columns1"
                [userProfile]="grid1"
                (onConfigChange)="configChange($event)"
                [pageSize]="5"
                [pageSizes]="[5, 10, 25]"&gt;
              &lt;/hci-grid&gt;
            </pre>
          </mat-menu>
        </div>
        <p>
          <hci-grid #grid1
                    [data]="data1"
                    [configurable]="true"
                    [columns]="columns1"
                    [userProfile]="grid1"
                    (onConfigChange)="configChange($event)"
                    [pageSize]="5"
                    [pageSizes]="[5, 10, 25]">
          </hci-grid>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Dynamic Config Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          The grid starts with two columns.  Clicking the buttons toggles between two sets of column definitions.  The
          second one adds a third column.  When the columns change, the grid refreshes.
        </div>
        <div class="card-text">
          <button class="btn btn-primary" (click)="setColumnsA1()">Columns 1</button>
          <button class="btn btn-primary" (click)="setColumnsA2()">Columns 2</button>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config2">Show Config</button>
          <mat-menu #config2="matMenu">
            <pre>
              &lt;hci-grid
                [title]="'Dynamic Columns Row Select'"
                [data]="data2"
                [columns]="columnsA"
                [eventListeners]="listeners2"&gt;
              &lt;/hci-grid&gt;
              
              Columns1:
              field: "idPatient", name: "ID", visible: false
              field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              
              Columns2:
              field: "idPatient", name: "ID", visible: false
              field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              field: "middleName", name: "Middle Name"
            </pre>
          </mat-menu>
        </div>
        <p>
          <hci-grid [title]="'Dynamic Columns Row Select'"
                    [data]="data2"
                    [columns]="columnsA"
                    [eventListeners]="listeners2">
          </hci-grid>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Set Config</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Click the button to push the following key value pair.  For example, you can try "title" with "Test".  Also, "theme" with "report".
        </div>
        <div class="card-text">
          <button class="btn btn-primary" (click)="pushConfig3()">Push:</button>
          <input [(ngModel)]="key" placeholder="key" />
          <input [(ngModel)]="value" placeholder="value" />
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config2">Show Config</button>
          <mat-menu #config2="matMenu">
            <pre>
              &lt;hci-grid
                [data]="data3"
                [config]="config3"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID"
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
            </pre>
          </mat-menu>
        </div>
        <p>
          <hci-grid #grid3
                    [data]="data3"
                    [config]="config3">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class DynamicConfigGridComponent {

  @HostBinding("class") classList: string = "demo-component";

  data1: Object[];
  columns1: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name", widthPercent: 40 },
    { field: "middleName", name: "Middle Name", widthPercent: 10 },
    { field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer },
    { field: "dob", name: "Date of Birth", dataType: "date", editRenderer: TextEditRenderer, filterRenderer: CompareFilterRenderer },
    { field: "gender", name: "Gender", editRenderer: ChoiceEditRenderer, choices: [ {value: "Female", display: "Female"}, {value: "Male", display: "Male"} ], filterRenderer: SelectFilterRenderer },
    { field: "nLabs", name: "# Labs", dataType: "number" },
  ];

  columnsA1: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30 },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" }
  ];

  columnsA2: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30 },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "middleName", name: "Middle Name" }
  ];

  columnsA: any = this.columnsA1;

  data2: Object[];
  listeners2: any[] = [
    {type: ClickRowSelectListener}
  ];

  data3: Object[];
  config3 = {
    title: "Config",
    columns: [
      {field: "idPatient", name: "ID"},
      {field: "lastName", name: "Last Name"},
      {field: "firstName", name: "First Name"}
    ]
  };

  key: string = "title";
  value: any = "Test";

  @ViewChild("grid3", {static: true}) grid3: GridComponent;

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data1 = this.dataGeneratorService.getData(123);
    this.data2 = this.dataGeneratorService.getData(7);
    this.data3 = this.dataGeneratorService.getData(7);
  }

  setColumnsA1() {
    this.columnsA = this.columnsA1;
  }

  setColumnsA2() {
    this.columnsA = this.columnsA2;
  }

  configChange(config: any) {
    console.debug("configChange");
    console.debug(config);
  }

  pushConfig3() {
    let o = {};
    o[this.key] = this.value;
    this.grid3.getGridService().updateConfig(o);
  }
}
