import {Component, HostBinding} from "@angular/core";

import {stringify} from "flatted/esm";

import {ClickView, ClickViewListener, ColumnDndListener} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "event-demo",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Select Row</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          A ClickView has been added as the last column.  Also, a ClickViewListener has been added to the grid.  The view
          contains and ID that when clicked on can be intercepted by a listener.  The listener, if clicked on that view,
          will then emit the key of the row through the (rowClick) event emitter.
          <div class="d-flex flex-nowrap" style="align-items: center; font-size: larger; font-weight: bold;">
            Selected Row ID: <span style="margin-left: 10px; color: red;">{{selectedRowID}}</span>
          </div>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config1">Show Config</button>
          <mat-menu #config1="matMenu">
            <pre>
              &lt;hci-grid
                [title]="'Row Select'"
                [data]="data1"
                [columns]="columns1"
                [eventListeners]="listeners1"
                (rowClick)="rowClick($event)"
                [nVisibleRows]="10"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID"
              field: "lastName", name: "Last Name"
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "gender", name: "Gender"
              field: "nLabs", name: "# Labs", dataType: "number"
              viewRenderer: ClickView, minWidth: 30, width: 30, maxWidth: 30
            </pre>
          </mat-menu>
        </div>
        <p>
          <hci-grid [title]="'Row Select'"
                    [data]="data1"
                    [columns]="columns1"
                    [eventListeners]="listeners1"
                    (rowClick)="rowClick($event)"
                    [nVisibleRows]="10">
          </hci-grid>
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>Column Sort</h4>
      </div>
      <div class="card-body">
        <div class="card-text">s
          Drag a column to another column to re-sort the columns.  Sorting only works within a container.  So the fixed
          columns can be sorted or the right columns can be sorted.  Dragging a right column to fixed doesn't work.
        </div>
        <div class="card-text">
          Column Sort Event: (see console)
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config2">Show Config</button>
          <mat-menu #config2="matMenu">
            <pre>
              &lt;hci-grid
                [title]="'Row Select'"
                [data]="data1"
                [columns]="columns1"
                [eventListeners]="listeners2"
                (rowClick)="rowClick($event)"
                [nVisibleRows]="10"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID"
              field: "lastName", name: "Last Name"
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "gender", name: "Gender"
              field: "nLabs", name: "# Labs", dataType: "number"
              viewRenderer: ClickView, minWidth: 30, width: 30, maxWidth: 30
            </pre>
          </mat-menu>
        </div>
        <p>
          <hci-grid [title]="'Column Drag n Drop'"
                    [data]="data1"
                    [columns]="columns2"
                    [eventListeners]="listeners2"
                    (listenerEvent)="setListenerEvent($event)"
                    [fixedColumns]="['lastName', 'firstName']"
                    [nVisibleRows]="10">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class EventComponent {

  @HostBinding("class") classList: string = "demo-component";

  columnsResorted: string = "";
  selectedRowID: number;

  data1: Object[];
  listeners1: Array<any> = [
    { type: ClickViewListener }
  ];

  columns1: any[] = [
    { field: "idPatient", name: "ID" },
    { field: "lastName", name: "Last Name" },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "nLabs", name: "# Labs", dataType: "number" },
    { viewRenderer: ClickView, minWidth: 30, width: 30, maxWidth: 30 }
  ];

  columns2: any[] = [
    { field: "idPatient", name: "ID" },
    { field: "lastName", name: "Last Name", widthPercent: 25 },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name", widthPercent: 25 },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "nLabs", name: "# Labs", dataType: "number" }
  ];

  listeners2: Array<any> = [
    { type: ColumnDndListener }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.data1 = this.dataGeneratorService.getData(50);
  }

  rowClick(event: any) {
    this.selectedRowID = +event;
  }

  setListenerEvent(event: any): void {
    console.info(event);
    this.columnsResorted = (event) ? stringify(event) : "";
  }
}
