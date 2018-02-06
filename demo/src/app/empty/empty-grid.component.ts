import { Component, OnInit } from "@angular/core";
import { Column } from "hci-ng-grid/index";

import { DataGeneratorService } from "../services/data-generator.service";

@Component({
  selector: "empty-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Simple Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          What a grid looks like with no data.
        </p>
        <p>
          <!--<hci-grid [title]="'Empty Grid'"
                    [inputData]="data">
            <column-def [field]="'lastName'"></column-def>
            <column-def [field]="'firstName'"></column-def>
            <column-def [field]="'dob'">
              <hci-grid-cell-date #template [dateFormat]="'longDate'"></hci-grid-cell-date>
            </column-def>
          </hci-grid>-->
        </p>
      </div>
    </div>
  `
})
export class EmptyGridComponent {

  data: Array<Object> = [];

}
