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
          What a grid with no data looks like.
        </p>
        <p>
          <hci-grid [title]="'Empty Grid'"
                    [data]="data"
                    [columnDefinitions]="[
                      { field: 'lastName' },
                      { field: 'firstName' },
                      { field: 'dob', dataType: 'date', format: 'MM/DD/YYYY' }
                    ]">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class EmptyGridComponent {

  data: Array<Object> = [];

}
