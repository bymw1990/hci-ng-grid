import {Component, HostBinding, OnInit} from "@angular/core";

import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

import {CompareFilterRenderer, SelectFilterRenderer, TextFilterRenderer} from "hci-ng-grid";
import {HciDataDto, HciFilterDto, HciGridDto, HciSortDto} from "hci-ng-grid-dto";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "external-data-demo",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>External Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          250 rows of data is generated in our service and stored.  We bind the onExternalDataCall which takes an object
          containing filtering/sorting/paging info.  Our data service applies the sorts/filters/pages to return a subset
          of data back to the grid.  This service mimics what a backend query would do with the same information.<br />
          In this demo we specify external call for all filter/sort/paging.  So any time a filter is changed, the page
          size is updated, or the next page is selected, this external function is called to retrieve the data.<br />
          To simulate an api call, a delay of 1 s has been added.
        </div>
        <div class="card-text">
          Filter Event: {{event1a | json}}
        </div>
        <div class="card-text">
          Data Filtered Event: {{event1b | json}}
        </div>
        <div class="card-text">
          Sort Event: {{event1c | json}}
        </div>
        <div class="card-text">
          Data Sorted Event: {{event1d | json}}
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
                [pageSize]="10"
                (filterEvent)="grid1FilterEvent($event)"
                (dataFiltered)="grid1DataFiltered($event)"
                (sortEvent)="grid1SortEvent($event)"
                (dataSorted)="grid1DataSorted($event)"&gt;
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
                    [pageSize]="10"
                    (filterEvent)="grid1FilterEvent($event)"
                    (dataFiltered)="grid1DataFiltered($event)"
                    (sortEvent)="grid1SortEvent($event)"
                    (dataSorted)="grid1DataSorted($event)">
          </hci-grid>
        </p>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h4>Partially External Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          The previous example had external filter/sort/page.  Here we have external filter and sort, but paging is left
          to the grid.  So our service applies filters and sorts to the data and always returns the full remaining dataset
          which leaves the paging to the grid.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config1">Show Config</button>
          <mat-menu #config1="matMenu" class="config">
            <pre>
              &lt;hci-grid
                [columns]="columns"
                [dataCall]="onExternalDataCall2"
                [externalFiltering]="true"
                [externalSorting]="true"
                [externalPaging]="false"
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
          External filter, sort.  Internal paging.
          <hci-grid [columns]="columns"
                    [dataCall]="onExternalDataCall2"
                    [externalFiltering]="true"
                    [externalSorting]="true"
                    [externalPaging]="false"
                    [pageSize]="10">
          </hci-grid>
        </p>
        <p>
          Internal filter, sort, paging.
          <hci-grid [columns]="columns"
                    [dataCall]="onExternalDataCall2"
                    [externalFiltering]="false"
                    [externalSorting]="false"
                    [externalPaging]="false"
                    [pageSize]="10">
          </hci-grid>
        </p>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h4>External Grid Returns Empty Array</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          With a delay of 1s, an empty array is returned.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config1">Show Config</button>
          <mat-menu #config1="matMenu" class="config">
            <pre>
              &lt;hci-grid
                [columns]="columns"
                [dataCall]="onExternalDataCall3"
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
                    [dataCall]="onExternalDataCall3"
                    [externalFiltering]="true"
                    [externalSorting]="true"
                    [externalPaging]="true"
                    [pageSize]="10">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class ExternalDataComponent implements OnInit {

  @HostBinding("class") classList: string = "demo-component";

  event1a: HciFilterDto[] = [];
  event1b: any;
  event1c: HciSortDto[] = [];
  event1d: any;
  dataSize: number = 250;

  public onExternalDataCall1: Function;
  public onExternalDataCall2: Function;
  public onExternalDataCall3: Function;

  columns: any[] = [
    { field: "idPatient", name: "ID", isKey: true },
    { field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer },
    { field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY", filterRenderer: CompareFilterRenderer },
    { field: "gender", name: "Gender", choices: [ {value: "Female", display: "Female"}, {value: "Male", display: "Male"} ], filterRenderer: SelectFilterRenderer },
    { field: "address", name: "Address" }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit(): void {
    this.dataGeneratorService.generateExternalData1(this.dataSize);
    this.dataGeneratorService.generateExternalData2(this.dataSize);

    this.onExternalDataCall1 = this.handleExternalDataCall1.bind(this);
    this.onExternalDataCall2 = this.handleExternalDataCall2.bind(this);
    this.onExternalDataCall3 = this.handleExternalDataCall3.bind(this);
  }

  grid1FilterEvent(event: HciFilterDto[]): void {
    of(undefined).pipe(delay(0)).subscribe(() => {
      this.event1a = event;
    });
  }

  grid1DataFiltered(event: any): void {
    of(undefined).pipe(delay(0)).subscribe(() => {
      this.event1b = event;
    });
  }

  grid1SortEvent(event: HciSortDto[]): void {
    of(undefined).pipe(delay(0)).subscribe(() => {
      this.event1c = event;
    });
  }

  grid1DataSorted(event: any): void {
    of(undefined).pipe(delay(0)).subscribe(() => {
      this.event1d = event;
    });
  }

  public handleExternalDataCall1(externalInfo: HciGridDto): Observable<HciDataDto> {
    console.info("handleExternalDataCall1");
    console.info(externalInfo);

    return of(this.dataGeneratorService.getExternalData1(externalInfo)).pipe(delay(1000));
  }

  public handleExternalDataCall2(externalInfo: HciGridDto): Observable<HciDataDto> {
    console.info("handleExternalDataCall2");
    console.info(externalInfo);

    return of(this.dataGeneratorService.getExternalData2(externalInfo)).pipe(delay(1000));
  }

  public handleExternalDataCall3(externalInfo: HciGridDto): Observable<HciDataDto> {
    return of(new HciDataDto([], externalInfo)).pipe(delay(1000));
  }
}
