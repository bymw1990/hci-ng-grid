import { Component, OnInit } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column, ExternalData, ExternalInfo } from "hci-ng-grid/index";

@Component({
  selector: "external-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>External Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          250 rows of data is generated in our service and stored.  We bind the onExternalDataCall which takes an object
          containing filtering/sorting/paging info.  Our data service applies the sorts/filters/pages to return a subset
          of data back to the grid.  This service mimics what a backend query would do with the same information.<br />
          In this demo we specify external call for all filter/sort/paging.  So any time a filter is changed, the page
          size is updated, or the next page is selected, this external function is called to retrieve the data.<br />
          To simulate an api call, a delay of 1 s has been added.
        </p>
        <p>
          <hci-grid [columnDefinitions]="columns"
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
        <h4>Partially External Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          The previous example had external filter/sort/page.  Here we have external filter and sort, but paging is left
          to the grid.  So our service applies filters and sorts to the data and always returns the full remaining dataset
          which leaves the paging to the grid.
        </p>
        <p>
          <hci-grid [columnDefinitions]="columns"
                    [dataCall]="onExternalDataCall2"
                    [externalFiltering]="true"
                    [externalSorting]="true"
                    [externalPaging]="false"
                    [pageSize]="10">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class ExternalGridComponent implements OnInit {

  dataSize: number = 250;

  public onExternalDataCall1: Function;
  public onExternalDataCall2: Function;

  columns: Column[] = [
    new Column({ field: "idPatient", name: "ID" }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "middleName", name: "Middle Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "address", name: "Address" })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.dataGeneratorService.generateExternalData1(this.dataSize);
    this.dataGeneratorService.generateExternalData2(this.dataSize);

    this.onExternalDataCall1 = this.handleExternalDataCall1.bind(this);
    this.onExternalDataCall2 = this.handleExternalDataCall2.bind(this);
  }

  public handleExternalDataCall1(externalInfo: ExternalInfo): Promise<ExternalData> {
    console.info("handleExternalDataCall1");
    console.info(externalInfo);

    return new Promise((resolve, reject) => {
      this.dataGeneratorService.getExternalData1(externalInfo).subscribe((externalData: ExternalData) => {
        setTimeout(() =>
          resolve(externalData), 1000
        );
      });
    });
  }

  public handleExternalDataCall2(externalInfo: ExternalInfo): Promise<ExternalData> {
    return new Promise((resolve, reject) => {
      this.dataGeneratorService.getExternalData2(externalInfo).subscribe((externalData: ExternalData) => {
        resolve(externalData);
      });
    });
  }
}
