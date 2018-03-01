import {Component} from "@angular/core";

import {ChoiceEditRenderer, Column, CompareFilterRenderer, DateEditRenderer, SelectFilterRenderer, TextFilterRenderer} from "hci-ng-grid/index";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "filter-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Filter Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          There are three types of filters here.  A string, select and compare filter.  The compare is on the date of
          birth and number of labs.  The select is on the gender.
          <div class="d-flex flex-nowrap" style="align-items: center;">
            <a class="btn btn-primary" (click)="initData()">Re-generate Data</a><br />
            <span style="margin-left: 20px; font-size: 1.5em;">Size: </span>
            <input [(ngModel)]="dataSize" style="margin-left: 10px; font-size: 1.5em;" />
          </div>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [title]="'Filter Grid'"
                [data]="filteredData"
                [columnDefinitions]="filteredColumns"
                [pageSizes]="[10, 25, 100]"
                [cellSelect]="true"
                [keyNavigation]="true"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer
              field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY", editRenderer: DateEditRenderer, filterRenderer: CompareFilterRenderer
              field: "gender", name: "Gender", editRenderer: ChoiceEditRenderer, choices: [ {{"{"}}value: "Female", display: "Female"{{"}"}}, {{"{"}}value: "Male", display: "Male"{{"}"}} ], filterRenderer: SelectFilterRenderer
              field: "nLabs", name: "# Labs", dataType: "number", filterRenderer: CompareFilterRenderer
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Filter Grid'"
                    [data]="filteredData"
                    [columnDefinitions]="filteredColumns"
                    [pageSizes]="[10, 25, 100]"
                    [cellSelect]="true"
                    [keyNavigation]="true">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class FilterGridComponent {

  dataSize: number = 250;
  filteredData: Array<Object>;

  filteredColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", visible: false }),
    new Column({ field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer }),
    new Column({ field: "middleName", name: "Middle Name" }),
    new Column({ field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY", editRenderer: DateEditRenderer, filterRenderer: CompareFilterRenderer }),
    new Column({ field: "gender", name: "Gender", editRenderer: ChoiceEditRenderer, choices: [ {value: "Female", display: "Female"}, {value: "Male", display: "Male"} ], filterRenderer: SelectFilterRenderer }),
    new Column({ field: "nLabs", name: "# Labs", dataType: "number", filterRenderer: CompareFilterRenderer })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.filteredData = this.dataGeneratorService.getData(this.dataSize);
  }
}
