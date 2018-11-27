import {Component} from "@angular/core";

import {ClickCellEditListener, CellHoverPopupListener, BigTextPopup, Column} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";
import {CompareFilterRenderer} from "hci-ng-grid";
import {LabFP} from "../components/lab.formatter";
import {LabPopup} from "../components/lab.component";

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
          Last and middle name have a basic popup that shows a string with wrap around.  Lab shows a custom popup to
          show additional data.
        </div>
        <div class="card-text">
          Hover over lastName, middleName or lab.  Enter in some very large text in lastName to see the popup word wrap.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [title]="'Cell Popup'"
                [data]="data1"
                [columns]="columns1"
                [fixedColumns]="['firstName', 'lastName']"
                [eventListeners]="listeners1"
                [nVisibleRows]="10"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name", popupRenderer: BigTextPopup
              field: "middleName", name: "Middle Name", popupRenderer: BigTextPopup
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "gender", name: "Gender"
              field: "nLabs", name: "# Labs", dataType: "number", filterRenderer: CompareFilterRenderer
              field: "lab", name: "Lab", formatterParser: LabFP, popupRenderer: LabPopup
              
              listeners1: Array&lt;any&gt; = [
                {{"{"}} type: ClickCellEditListener {{"}"}},
                {{"{"}} type: CellHoverPopupListener {{"}"}}
              ];
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Cell Popup'"
                    [data]="data1"
                    [columns]="columns1"
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
    new Column({ field: "idPatient", name: "ID", visible: false }),
    new Column({ field: "lastName", name: "Last Name", popupRenderer: BigTextPopup }),
    new Column({ field: "middleName", name: "Middle Name", popupRenderer: BigTextPopup }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "nLabs", name: "# Labs", dataType: "number", filterRenderer: CompareFilterRenderer }),
    new Column({ field: "lab", name: "Lab", formatterParser: LabFP, popupRenderer: LabPopup })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.data1 = this.dataGeneratorService.getData(50);
    this.data1[0]["lastName"] = "Byrne Smith Roberts Reynolds III Esquire";
  }

}
