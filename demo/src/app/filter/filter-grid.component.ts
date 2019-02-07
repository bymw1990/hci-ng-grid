import {Component} from "@angular/core";

import {
  ChoiceEditRenderer, Column, CompareFilterRenderer, DateEditRenderer, SortInfo, FilterInfo, SelectFilterRenderer,
  TextFilterRenderer
} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";
import {DictionaryFilterRenderer} from "./dictionary-filter.component";

@Component({
  selector: "filter-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Filter Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          There are three types of filters here.  A string, select and compare filter.  The compare is on the date of
          birth and number of labs.  The select is on the gender.
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
                [title]="'Filter Grid'"
                [data]="filteredData"
                [columns]="filteredColumns"
                [mode]="'spreadsheet'"
                [pageSizes]="[10, 25, 100]"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer
              field: "dob", name: "Date of Birth", dataType: "date", editRenderer: DateEditRenderer, filterRenderer: CompareFilterRenderer
              field: "gender", name: "Gender", editRenderer: ChoiceEditRenderer, choices: [ {{"{"}}value: "Female", display: "Female"{{"}"}}, {{"{"}}value: "Male", display: "Male"{{"}"}} ], filterRenderer: SelectFilterRenderer
              field: "nLabs", name: "# Labs", dataType: "number", filterRenderer: CompareFilterRenderer
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Filter Grid'"
                    [data]="filteredData"
                    [columns]="filteredColumns"
                    [mode]="'spreadsheet'"
                    [pageSizes]="[10, 25, 100]">
          </hci-grid>
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>Custom Filters</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          The gender column has a custom renderer, sort function and filter function.  The sort just does a reverse of
          the expected behavior.  The filter includes a subset word search.  So searching male will include female but
          unknown will be excluded.  The renderer is a copy of the default select renderer, but will later add some
          configuration as an example.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config2" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config2>
            <pre>
              &lt;hci-grid
                [data]="filteredData"
                [columns]="filteredColumns2"
                [pageSizes]="[10, 25, 100]"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer
              field: "dob", name: "Date of Birth", dataType: "date", editRenderer: DateEditRenderer, filterRenderer: CompareFilterRenderer
              field: "genderDict",
                name: "Gender",
                dataType: "choice",
                choiceUrl: "http://localhost/dictionary/gender",
                filterRenderer: DictionaryFilterRenderer,
                filterFunction: this.customFilter, sortFunction: this.customSort
              field: "nLabs", name: "# Labs", dataType: "number", filterRenderer: CompareFilterRenderer
              
              customSort(a: any, b: any, sortInfo: SortInfo, column: Column): number {{"{"}}
                if (sortInfo.asc) {{"{"}}
                  return b - a;
                {{"}"}} else {{"{"}}
                  return a - b;
                {{"}"}}
              }
              
              customFilter(value: any, filters: FilterInfo[], column: Column): boolean {{"{"}}
                for (let filterInfo of filters) {{"{"}}
                  if (column.choiceMap.get(value).toString().toLowerCase().indexOf(column.choiceMap.get(filterInfo.value).toString().toLowerCase()) === -1) {{"{"}}
                    return false;
                  {{"}"}}
                {{"}"}}
            
                return true;
              {{"}"}}
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="filteredData2"
                    [columns]="filteredColumns2">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class FilterGridComponent {

  dataSize: number = 250;
  filteredData: Object[];

  filteredColumns: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name", filterRenderer: TextFilterRenderer },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer },
    { field: "dob", name: "Date of Birth", dataType: "date", editRenderer: DateEditRenderer, filterRenderer: CompareFilterRenderer },
    { field: "gender", name: "Gender", editRenderer: ChoiceEditRenderer, choices: [ {value: "Female", display: "Female"}, {value: "Male", display: "Male"} ], filterRenderer: SelectFilterRenderer },
    { field: "nLabs", name: "# Labs", dataType: "number", filterRenderer: CompareFilterRenderer }
  ];

  filteredData2: Object[];

  filteredColumns2: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name" },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth" },
    { field: "genderDict",
      name: "Gender",
      dataType: "choice",
      choiceUrl: "http://localhost/dictionary/gender",
      filterRenderer: DictionaryFilterRenderer,
      filterFunction: this.customFilter, sortFunction: this.customSort },
    { field: "nLabs", name: "# Labs", dataType: "number" }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.filteredData = this.dataGeneratorService.getData(this.dataSize);
    this.filteredData2 = this.dataGeneratorService.getData(this.dataSize);
  }

  customSort(a: any, b: any, sortInfo: SortInfo, column: Column): number {
    if (sortInfo.asc) {
      return b - a;
    } else {
      return a - b;
    }
  }

  customFilter(value: any, filters: FilterInfo[], column: Column): boolean {
    for (let filterInfo of filters) {
      if (column.choiceMap.get(value).toString().toLowerCase().indexOf(column.choiceMap.get(filterInfo.value).toString().toLowerCase()) === -1) {
        return false;
      }
    }

    return true;
  }
}
