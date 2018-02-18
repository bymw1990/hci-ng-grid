import {Component, ViewEncapsulation} from "@angular/core";

import {Column} from "hci-ng-grid/index";
import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "style-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Excel (default) Theme</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          This is the default theme which borders every cell.
        </p>
        <p>
          <hci-grid [data]="data1"
                    [columnDefinitions]="columns">
          </hci-grid>
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>No Theme (override the default)</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          TODO
        </p>
        <p>
          <hci-grid [data]="data2"
                    [columnDefinitions]="columns"
                    [theme]="''">
          </hci-grid>
        </p>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h4>Report Theme</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          TODO
        </p>
        <p>
          <hci-grid [title]="'Demographics Report'"
                    [data]="data3"
                    [columnDefinitions]="columns"
                    [theme]="'report'"
                    [nVisibleRows]="-1">
          </hci-grid>
        </p>
      </div>
    </div>
  `,
  styles: [ `
  
  ` ],
  encapsulation: ViewEncapsulation.None
})
export class ThemingComponent {

  data1: Array<Object> = [];
  data2: Array<Object> = [];
  data3: Array<Object> = [];

  columns: Column[] = [
    new Column({ field: "lastName", name: "Last" }),
    new Column({ field: "firstName", name: "First" }),
    new Column({ field: "dob", name: "Birth Date", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "address", name: "Address" }),
    new Column({ field: "nLabs", name: "# Labs" })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data1 = this.dataGeneratorService.getData(11);
    this.data2 = this.dataGeneratorService.getData(13);
    this.data3 = this.dataGeneratorService.getData(17);
  }

}
