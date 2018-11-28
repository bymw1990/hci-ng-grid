import {Component} from "@angular/core";

import {Column, RangeSelectListener} from "hci-ng-grid";
import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "alerts-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Capture Warnings</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          Try copying a 2x2 range of cells with ctrl-c.  Then select the bottom row, first column.  Hit escape to stop edit mode.
          Then ctrl-v to paste.  The console won't show the warning because we set logWarnings to false.  But we capture it ourselves.
          used.<br />
          <span style="color: red;">{{warning}}</span>
        </p>
        <p>
          <hci-grid [data]="data1"
                    [columns]="columns1"
                    [eventListeners]="listeners"
                    [logWarnings]="false"
                    (warning)="showWarning($event)">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class AlertsGridComponent {

  warning: string;

  data1: any[];

  columns1: any[] = [
    { field: "idPatient", name: "ID", template: "LabelCell" },
    { field: "lastName", name: "Last Name", template: "LabelCell" },
    { field: "middleName", name: "Middle Name", template: "LabelCell" },
    { field: "firstName", name: "First Name", template: "LabelCell" },
    { field: "gender", name: "Gender", template: "LabelCell" },
    { field: "address", name: "Address", template: "LabelCell" }
  ];

  listeners: any[] = [
    {type: RangeSelectListener}
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {
    this.data1 = this.dataGeneratorService.getData(6);
  }

  showWarning(warning: string) {
    this.warning = warning;
  }
}
