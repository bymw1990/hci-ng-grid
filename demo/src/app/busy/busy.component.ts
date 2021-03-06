import {Component, HostBinding, OnInit, ViewChild} from "@angular/core";

import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

import {CompareFilterRenderer, GridComponent, SelectFilterRenderer, TextFilterRenderer} from "hci-ng-grid";
import {HciDataDto, HciGridDto} from "hci-ng-grid-dto";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "busy-demo",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Busy in External Data Call</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          A five second delay has been added to the fetching of external data.  The busy mode is triggered prior to the
          call and terminated when the response comes back.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config1">Show Config</button>
          <mat-menu #config1="matMenu" class="config">
            <pre>
              &lt;hci-grid
                [columns]="columns"
                [dataCall]="onExternalDataCall1"
                [externalFiltering]="true"
                [externalSorting]="true"
                [externalPaging]="true"
                [pageSize]="10"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID"
              field: "lastName", name: "Last Name"
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
            </pre>
          </mat-menu>
        </div>
        <p>
          <hci-grid [columns]="columns"
                    [dataCall]="onExternalDataCall1"
                    [externalFiltering]="true"
                    [externalSorting]="true"
                    [externalPaging]="true"
                    [pageSize]="10">
          </hci-grid>
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>Custom Busy Template and Manual Trigger</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          The busy template can be replaced with your own template.  In the most simple case, the icon can be changed.
        </div>
        <div class="card-text">
          When an external data call is provided, the grid handles busy itself.  However, it is possible for you to handle
          your own update of the bound data.  When the bound data changes, the grid will instantly update but it has no
          idea about when the request was made.  So the grid allows you to get the busySubject and set it to true when
          you are requesting data, and then set it to false when the response comes back.
          <button (click)="setBusy(true)" class="mr-3">Set Busy</button>
          <button (click)="setBusy(false)" class="mr-3">Remove Busy</button>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config2">Show Config</button>
          <mat-menu #config2="matMenu" class="config">
            <pre>
              &lt;hci-grid
                [columns]="columns"
                [dataCall]="onExternalDataCall1"
                [externalFiltering]="true"
                [externalSorting]="true"
                [externalPaging]="true"
                [pageSize]="10"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID"
              field: "lastName", name: "Last Name"
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
            </pre>
          </mat-menu>
        </div>
        <p>
          <hci-grid #grid2
                    [columns]="columns"
                    [busyTemplate]="busyTemplate"
                    [dataCall]="onExternalDataCall1"
                    [externalFiltering]="true"
                    [externalSorting]="true"
                    [externalPaging]="true"
                    [pageSize]="10">
          </hci-grid>
        </p>
      </div>
    </div>

    <ng-template #busyTemplate>
      <div style="background-color: rgba(0, 0, 0, 0.025); display: flex; flex-grow: 1;">
        <div class="mx-auto my-auto">
          <i class="fas fa-spinner fa-5x fa-spin" style="color: red;"></i>
        </div>
      </div>
    </ng-template>
  `
})
export class BusyDemoComponent implements OnInit {

  @HostBinding("class") classList: string = "demo-component";

  @ViewChild("grid2", {static: true}) grid2: GridComponent;

  dataSize: number = 250;

  public onExternalDataCall1: Function;

  columns: any[] = [
    { field: "idPatient", name: "ID" },
    { field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer },
    { field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY", filterRenderer: CompareFilterRenderer },
    { field: "gender", name: "Gender", choices: [ {value: "Female", display: "Female"}, {value: "Male", display: "Male"} ], filterRenderer: SelectFilterRenderer },
    { field: "address", name: "Address" }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.dataGeneratorService.generateExternalData1(this.dataSize);

    this.onExternalDataCall1 = this.handleExternalDataCall1.bind(this);
  }

  setBusy(busy: boolean): void {
    this.grid2.getBusySubject().next(busy);
  }

  public handleExternalDataCall1(externalInfo: HciGridDto): Observable<HciDataDto> {
    console.info("handleExternalDataCall1");
    console.info(externalInfo);

    return of(this.dataGeneratorService.getExternalData1(externalInfo)).pipe(delay(5000));
  }

}
