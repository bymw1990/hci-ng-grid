import {Component} from "@angular/core";

import {Column} from "hci-ng-grid/index";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "resize-demo",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Resize Parent</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Test a parent resize.
          <div class="d-flex flex-nowrap" style="align-items: center;">
            <span style="margin-left: 20px; font-size: 1.5em;">Width: </span>
            <input [ngModel]="width" (ngModelChange)="setWidth($event)" style="margin-left: 10px; font-size: 1.5em;" />
          </div>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [title]="'Paging Grid'"
                [data]="data"
                [columnDefinitions]="pagingColumns"
                [pageSize]="10"
                [pageSizes]="[10, 25, 100]&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
            </pre>
          </ng-template>
        </div>
        <div [style.width.px]="width">
          <hci-grid [title]="'Paging Grid'"
                    [data]="data"
                    [columnDefinitions]="columns"
                    [pageSize]="10"
                    [pageSizes]="[10, 25, 100]">
          </hci-grid>
        </div>
      </div>
    </div>
  `
})
export class ResizeDemoComponent {

    width: number = 800;

    dataSize: number = 250;
    data: Array<Object>;

    columns: Column[] = [
        new Column({ field: "idPatient", name: "ID", visible: false }),
        new Column({ field: "lastName", name: "Last Name" }),
        new Column({ field: "middleName", name: "Middle Name" }),
        new Column({ field: "firstName", name: "First Name" }),
        new Column({ field: "dob", name: "Date of Birth", dataType: "date" }),
        new Column({ field: "gender", name: "Gender" }),
        new Column({ field: "address", name: "Address" })
    ];

    constructor(private dataGeneratorService: DataGeneratorService) {}

    ngOnInit() {
        this.initData();
    }

    initData() {
        this.data = this.dataGeneratorService.getData(this.dataSize);
    }

    setWidth(width: number) {
        this.width = width;
        window.dispatchEvent(new Event("resize"));
    }
}
