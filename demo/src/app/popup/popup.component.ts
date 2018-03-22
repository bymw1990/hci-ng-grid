import {Component} from "@angular/core";

import {ClickCellEditListener, CellHoverPopupListener, BigTextPopup, ClickView, ClickViewListener, Column, EventListenerArg} from "hci-ng-grid/index";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "event-demo",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Cell Popup</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          If a cell has a large block of text, it shows a ... at the overflow.  To show the full text, you can add a listener
          such that when you hover over the cell, a popup appears with the full text.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              TODO
              &lt;hci-grid
                [title]="'Cell Popup'"
                [data]="data1"
                [columnDefinitions]="columns1"
                [fixedColumns]="['firstName', 'lastName']"
                [eventListeners]="listeners1"
                [nVisibleRows]="10"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID"
              field: "lastName", name: "Last Name", popupRenderer: BigTextPopup
              field: "middleName", name: "Middle Name", popupRenderer: BigTextPopup
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY"
              field: "gender", name: "Gender"
              field: "nLabs", name: "# Labs", dataType: "number"
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Cell Popup'"
                    [data]="data1"
                    [columnDefinitions]="columns1"
                    [fixedColumns]="['firstName', 'lastName']"
                    [eventListeners]="listeners1"
                    [nVisibleRows]="10">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class PopupComponent {

  data1: Array<Object>;
  listeners1: Array<any> = [
    { type: ClickCellEditListener },
    { type: CellHoverPopupListener }
  ];

  columns1: Column[] = [
    new Column({ field: "idPatient", name: "ID" }),
    new Column({ field: "lastName", name: "Last Name", popupRenderer: BigTextPopup }),
    new Column({ field: "middleName", name: "Middle Name", popupRenderer: BigTextPopup }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "nLabs", name: "# Labs", dataType: "number" })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.data1 = this.dataGeneratorService.getData(50);
  }

}
