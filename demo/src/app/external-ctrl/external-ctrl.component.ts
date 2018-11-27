import {Component, OnInit, ViewChild} from "@angular/core";

import {Observable} from "rxjs/Observable";

import {Column, GridComponent} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "external-ctl-demo",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Externally Controlled Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          The implementation can grab the GridComponent with @ViewChild and then call functions on the grid.  Here you
          can change pages programmatically.  Furthermore, rendering depends on the parent container being visible.  So
          if you hide the grid, change pages and then un-hide the grid, you need to call doRender().
        </div>
        <div class="card-text">
          <button (click)="toggleHidden()">Toggle Hidden</button>
          <button (click)="previousPage()">Previous</button>
          <button (click)="nextPage()">Next</button>
        </div>
        <div class="card-text">
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
                [title]="'Externalyl Controlled Grid'"
                [data]="data"
                [columns]="columns"
                [pageSize]="10"
                [pageSizes]="[10, 25, 100]&gt;
              &lt;/hci-grid&gt;
              
              @ViewChild("grid") grid: GridComponent;
              
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
        <div id="parent" [style.display]="hidden ? 'none' : 'inherit'">
          <hci-grid #grid
                    [title]="'Externally Controlled Grid'"
                    [data]="data"
                    [columns]="columns"
                    [pageSize]="10"
                    [pageSizes]="[10, 25, 100]">
          </hci-grid>
        </div>
      </div>
    </div>
  `
})
export class ExternalControlComponent implements OnInit {

  @ViewChild("grid") grid: GridComponent;

  hidden: boolean = false;
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
    this.dataGeneratorService.generatePagingData(this.dataSize);
    this.data = this.dataGeneratorService.getPagingData(null, null, null);
  }

  toggleHidden() {
    this.hidden = !this.hidden;
    if (!this.hidden) {
      this.grid.doRender(10, "parent");
    }
  }

  nextPage() {
    this.grid.doPageNext();
  }

  previousPage() {
    this.grid.doPagePrevious();
  }
}
