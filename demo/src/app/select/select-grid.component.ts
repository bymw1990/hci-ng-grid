import {Component, HostBinding, ViewChild} from "@angular/core";
import {SafeHtml} from "@angular/platform-browser";

import {CheckRowSelectView, ClickRowSelectListener, GridComponent, RowDblClickListener} from "hci-ng-grid";

import {BaseDemoComponent} from "../base-demo.component";
import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "select-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Row Select</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Double click on a row.
          <div class="d-flex flex-nowrap" style="align-items: center; font-size: larger; font-weight: bold;">
            Double Clicked Key: <span style="margin-left: 10px; color: red;">{{clickedRow}}</span>
          </div>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <div [innerHTML]="config1Html"></div>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data1"
                    [columns]="columns1"
                    [eventListeners]="listeners1"
                    (rowDblClick)="rowDblClick($event)">
          </hci-grid>
        </p>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h4>Single Row Select</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Click on check boxes.
          <span>Selected Row IDs:</span>
          <span *ngIf="selectedRows2.length === 0">None</span>
          <span *ngFor="let selectedRow of selectedRows2" style="padding-left: 5px;">
           {{selectedRow}}
         </span>
        </div>
        <div class="card-text">
          <a class="btn btn-primary" (click)="clearSelectedRows2()">Clear Selected Rows</a>
          <a class="btn btn-primary" (click)="deleteSelectedRows2()" style="margin-left: 10px;">Delete Selected Rows</a>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config2" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config2>
            <div [innerHTML]="config2Html"></div>
          </ng-template>
        </div>
        <div>
          <hci-grid #grid2
                    [data]="data2"
                    [columns]="columns2"
                    [eventListeners]="listeners2"
                    (selectedRows)="setSelectedRows2($event)"
                    [pageSize]="5"
                    [pageSizes]="[5, 10]">
          </hci-grid>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>Multiple Row Select</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Click on check boxes.
          <span>Selected Row IDs:</span>
          <span *ngIf="selectedRows3.length === 0">None</span>
          <span *ngFor="let selectedRow of selectedRows3" style="padding-left: 5px;">
           {{selectedRow}}
         </span>
        </div>
        <div class="card-text">
          <a class="btn btn-primary" (click)="clearSelectedRows3()">Clear Selected Rows</a>
          <a class="btn btn-primary" (click)="deleteSelectedRows3()" style="margin-left: 10px;">Delete Selected Rows</a>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config3" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config3>
            <div [innerHTML]="config3Html"></div>
          </ng-template>
        </div>
        <div>
          <hci-grid #grid3
                    [data]="data3"
                    [columns]="columns3"
                    [eventListeners]="listeners3"
                    (selectedRows)="setSelectedRows3($event)">
          </hci-grid>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h4>Custom Row Select Icons</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config4" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config4>
            <div [innerHTML]="config4Html"></div>
          </ng-template>
        </div>
        <div>
          <hci-grid #grid4
                    [data]="data4"
                    [columns]="columns4"
                    [eventListeners]="listeners4"
                    [nVisibleRows]="5">
          </hci-grid>
        </div>
      </div>
    </div>
  `
})
export class SelectGridComponent extends BaseDemoComponent {

  @HostBinding("class") classList: string = "demo-component";

  @ViewChild("grid2") grid2: GridComponent;
  @ViewChild("grid3") grid3: GridComponent;

  clickedRow: any;
  selectedRows2: any[] = [];
  selectedRows3: any[] = [];

  data1: any[];
  columns1: any[] = [
    { isKey: true, field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "nLabs", name: "# Labs" },
    { field: "path.nPath", name: "# Lab Path" }
  ];
  listeners1: Array<any> = [
    { type: RowDblClickListener }
  ];

  config1Grid: string = `
    <hci-grid [data]="data1"
              [columns]="columns1"
              [eventListeners]="listeners1"
              (rowDblClick)="rowDblClick($event)">
    </hci-grid>
  `;
  config1Columns: string = `
    columns1: any[] = [
      { isKey: true, field: "idPatient", name: "ID", visible: false }),
      { field: "lastName", name: "Last Name" }),
      { field: "firstName", name: "First Name" }),
      { field: "dob", name: "Date of Birth", dataType: "date" }),
      { field: "nLabs", name: "# Labs" }),
      { field: "path.nPath", name: "# Lab Path" })
    ];
  `;
  config1Listeners: string = `
    listeners1: Array<any> = [
      { type: RowDblClickListener }
    ];
  `;
  config1Html: SafeHtml;

  data2: any[];
  columns2: any[] = [
    { field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30 },
    { isKey: true, field: "idPatient", name: "ID" },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "nLabs", name: "# Labs" },
    { field: "path.nPath", name: "# Lab Path" }
  ];
  listeners2: Array<any> = [
    { type: ClickRowSelectListener }
  ];

  config2Grid: string = `
    <hci-grid #grid2
              [data]="data2"
              [columns]="columns2"
              [eventListeners]="listeners2"
              (selectedRows)="setSelectedRows2($event)"
              [pageSize]="5"
              [pageSizes]="[5, 10]">
    </hci-grid>
  `;
  config2Columns: string = `
    columns2: any[] = [
      { field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30 }),
      { isKey: true, field: "idPatient", name: "ID" }),
      { field: "lastName", name: "Last Name" }),
      { field: "firstName", name: "First Name" }),
      { field: "dob", name: "Date of Birth", dataType: "date" }),
      { field: "nLabs", name: "# Labs" }),
      { field: "path.nPath", name: "# Lab Path" })
    ];
  `;
  config2Listeners: string = `
    listeners2: Array<any> = [
      { type: ClickRowSelectListener }
    ];
  `;
  config2Html: SafeHtml;

  data3: any[];
  columns3: any[] = [
    { field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30 },
    { isKey: true, field: "idPatient", name: "ID", visible: true },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "nLabs", name: "# Labs" },
    { field: "path.nPath", name: "# Lab Path" }
  ];
  listeners3: any[] = [
    { type: ClickRowSelectListener, config: {multiSelect: true} }
  ];

  config3Grid: string = `
    <hci-grid #grid3
              [data]="data3"
              [columns]="columns3"
              [eventListeners]="listeners3"
              (selectedRows)="setSelectedRows3($event)">
    </hci-grid>
  `;
  config3Columns: string = `
    columns3: any[] = [
      { field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30 },
      { isKey: true, field: "idPatient", name: "ID", visible: true },
      { field: "lastName", name: "Last Name" },
      { field: "firstName", name: "First Name" },
      { field: "dob", name: "Date of Birth", dataType: "date" },
      { field: "nLabs", name: "# Labs" },
      { field: "path.nPath", name: "# Lab Path" }
    ];
  `;
  config3Listeners: string = `
    listeners3: any[] = [
      { type: ClickRowSelectListener, config: {multiSelect: true} }
    ];
  `;
  config3Html: SafeHtml;

  data4: any[];
  columns4: any[] = [
    { field: "select", viewRenderer: CheckRowSelectView, viewConfig: {checkedIcon: "fas fa-check-circle", uncheckedIcon: "fas fa-arrow-alt-circle-down"}, width: 30, minWidth: 30, maxWidth: 30 },
    { isKey: true, field: "idPatient", name: "ID", visible: true },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "nLabs", name: "# Labs" },
    { field: "path.nPath", name: "# Lab Path" }
  ];
  listeners4: any[] = [
    { type: ClickRowSelectListener, config: {multiSelect: true} }
  ];

  config4Grid: string = `
    <hci-grid #grid4
              [data]="data4"
              [columns]="columns4"
              [eventListeners]="listeners4"
              [nVisibleRows]="5">
    </hci-grid>
  `;
  config4Columns: string = `
    columns4: any[] = [
      { field: "select", viewRenderer: CheckRowSelectView, viewConfig: {checkedIcon: "fas fa-check-circle", uncheckedIcon: "fas fa-arrow-alt-circle-down"}, width: 30, minWidth: 30, maxWidth: 30 },
      { isKey: true, field: "idPatient", name: "ID", visible: true },
      { field: "lastName", name: "Last Name" },
      { field: "firstName", name: "First Name" },
      { field: "dob", name: "Date of Birth", dataType: "date" },
      { field: "nLabs", name: "# Labs" },
      { field: "path.nPath", name: "# Lab Path" }
    ];
  `;
  config4Listeners: string = `
    listeners4: any[] = [
      { type: ClickRowSelectListener, config: {multiSelect: true} }
    ];
  `;
  config4Html: SafeHtml;

  constructor(private dataGeneratorService: DataGeneratorService) {
    super();

    this.data1 = dataGeneratorService.getData(6);
    this.data2 = dataGeneratorService.getData(8);
    this.data3 = dataGeneratorService.getData(9);
    this.data4 = dataGeneratorService.getData(11);
  }

  ngOnInit() {
    this.config1Html = this.generateConfig(this.config1Grid, this.config1Columns, this.config1Listeners);
    this.config2Html = this.generateConfig(this.config2Grid, this.config2Columns, this.config2Listeners);
    this.config3Html = this.generateConfig(this.config3Grid, this.config3Columns, this.config3Listeners);
    this.config4Html = this.generateConfig(this.config4Grid, this.config4Columns, this.config4Listeners);
  }

  rowDblClick(event: any) {
    this.clickedRow = +event;
  }

  setSelectedRows2(selectedRows: any[]) {
    this.selectedRows2 = selectedRows;
  }

  clearSelectedRows2() {
    this.grid2.getGridService().clearSelectedRows();
  }

  deleteSelectedRows2() {
    this.grid2.deleteSelectedRows();
  }

  setSelectedRows3(selectedRows: any[]) {
    this.selectedRows3 = selectedRows;
  }

  clearSelectedRows3() {
    this.grid3.getGridService().clearSelectedRows();
  }

  deleteSelectedRows3() {
    this.grid3.deleteSelectedRows();
  }
}
