import {Component, OnInit} from "@angular/core";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "simple-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Simple Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          A grid uses the default configuration.  Only inputs are title, data and columns.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [title]="'Simple Grid'"
                [data]="data1"
                [columns]="[
                  {{"{"}} field: 'lastName' {{"}"}},
                  {{"{"}} field: 'firstName' {{"}"}},
                  {{"{"}} field: 'dob', dataType: 'date' {{"}"}},
                  {{"{"}} field: 'pcg.nLabs' {{"}"}},
                  {{"{"}} field: 'pcg.nested.nLabPath' {{"}"}},
                ]&gt;
              &lt;/hci-grid&gt;
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Simple Grid'"
                    [data]="data1"
                    [columns]="[
                      { field: 'lastName' },
                      { field: 'firstName' },
                      { field: 'dob', dataType: 'date' },
                      { field: 'pcg.nLabs' },
                      { field: 'pcg.nested.nLabPath' }
                    ]">
          </hci-grid>
        </p>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h4>More Simple Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Here we pass the data array and column definitions.  The column definitions specify the complex data path and the
          template type and that is all.  There is no filtering, header, sorting or paging.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config2" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config2>
            <pre>
              &lt;hci-grid
                [data]="data2"
                [columns]="[
                  {{"{"}} field: 'lastName' {{"}"}},
                  {{"{"}} field: 'firstName' {{"}"}},
                  {{"{"}} field: 'dob', dataType: 'date' {{"}"}},
                  {{"{"}} field: 'pcg.nLabs' {{"}"}},
                  {{"{"}} field: 'pcg.nested.nLabPath' {{"}"}}
                ]&gt;
              &lt;/hci-grid&gt;
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data2"
                    [columns]="[
                      { field: 'lastName' },
                      { field: 'firstName' },
                      { field: 'dob', dataType: 'date' },
                      { field: 'pcg.nLabs' },
                      { field: 'pcg.nested.nLabPath' }
                    ]">
          </hci-grid>
        </p>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h4>Even More Simple Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Here the only thing passed in is the data.  Visible label columns are created automatically based on every key
          in the object.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config3" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config3>
            <pre>
              &lt;hci-grid
                [data]="data3"
                [columns]="[
                  {{"{"}} field: 'lastName', name: 'Last Name' {{"}"}},
                  {{"{"}} field: 'firstName', name: 'First Name' {{"}"}}
                ]&gt;
              &lt;/hci-grid&gt;
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data3"
                    [columns]="[
                      { field: 'lastName', name: 'Last Name' },
                      { field: 'firstName', name: 'First Name' }
                    ]">
          </hci-grid>
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>Simple Grid - 5s Delayed Input</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Typical data input passed in bulk, but with a 5s delay in receiving the data.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config4" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config4>
            <pre>
              &lt;hci-grid
                [title]="'Simple Grid Delayed'"
                [data]="data4"
                [columns]="columns4"&gt;
              &lt;/hci-grid&gt;
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Simple Grid Delayed'"
                    [data]="data4"
                    [columns]="columns4">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class SimpleGridComponent implements OnInit {

  columns4: any[] = [
    { field: "idPatient", name: "ID", visible: true },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "address", name: "Address 1" },
    { field: "citystatezip", name: "Address 2" }
  ];

  data1: Object[];
  data2: Object[];
  data3: Object[];
  data4: Object[];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data1 = this.dataGeneratorService.getData(6);
    this.data2 = this.dataGeneratorService.getData(6);
    this.data3 = this.dataGeneratorService.getData(6);
    
    this.dataGeneratorService.generateSimpleData4(55);
    this.dataGeneratorService.getSimpleData4(5000).subscribe((data4: Object[]) => {
      this.data4 = data4;
    });
  }

}
