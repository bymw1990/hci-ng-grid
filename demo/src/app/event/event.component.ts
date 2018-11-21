import {Component} from "@angular/core";

import {ClickView, ClickViewListener, Column, EventListenerArg} from "hci-ng-grid";

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
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [title]="'Row Select'"
                [data]="data1"
                [columnDefinitions]="columns1"
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
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Row Select'"
                    [data]="data1"
                    [columnDefinitions]="columns1"
                    [eventListeners]="listeners1"
                    (rowClick)="rowClick($event)"
                    [nVisibleRows]="10">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class EventComponent {

  selectedRowID: number;

  data1: Array<Object>;
  listeners1: Array<any> = [
    { type: ClickViewListener }
  ];

  columns1: Column[] = [
    new Column({ field: "idPatient", name: "ID" }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "middleName", name: "Middle Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "nLabs", name: "# Labs", dataType: "number" }),
    new Column({ viewRenderer: ClickView, minWidth: 30, width: 30, maxWidth: 30 })
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
}
