import {Component, HostBinding} from "@angular/core";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "empty-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Empty Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          What a grid with no data looks like.
        </p>
        <p>
          <hci-grid [title]="'Empty Grid'"
                    [data]="data1"
                    [columns]="[
                      { field: 'lastName', name: 'Last Name' },
                      { field: 'firstName', name: 'First Name' },
                      { field: 'dob', name: 'Date of Birth', dataType: 'date' }
                    ]">
          </hci-grid>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Populate Null Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          What a grid with no data and no columns.
          <button class="btn btn-primary" (click)="populate()">Populate</button>
        </p>
        <p>
          <hci-grid [title]="'Empty Grid'"
                    [data]="data2"
                    [columns]="columns2">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class EmptyGridComponent {

  @HostBinding("class") classList: string = "demo-component";

  data1: Object[] = [];

  data2: Object[] = [];
  columns2: any[] = [];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  populate() {
    this.data2 = this.dataGeneratorService.getData(5);
    this.columns2 = [
      {field: "lastName", name: "Last Name"},
      {field: "firstName", name: "First Name"},
      {field: "dob", name: "Date of Birth", dataType: "date"}
    ];
  }
}
