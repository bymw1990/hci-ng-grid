import {Component, HostBinding, ViewEncapsulation} from "@angular/core";

import {CellNumberRangeView, ClickView, ClickViewListener} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "style-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Spreadsheet (default) Theme</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          This is the default theme which borders every cell.<br />
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right" container="body">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid [data]="data1"
                       [columns]="columns"
                       [pageSize]="10"
                       [pageSizes]="[5, 10, 25]"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "lastName", name: "Last"
              field: "firstName", name: "First"
              field: "dob", name: "Birth Date", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
              field: "nLabs", name: "# Labs"
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data1"
                    [columns]="columns"
                    [pageSize]="10"
                    [pageSizes]="[5, 10, 25]">
          </hci-grid>
        </p>
      </div>
    </div>
  
    <div class="card">
      <div class="card-header">
        <h4>No Theme (override the default)</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Force overriding of the theme to one that doesn't exist will show the default which has no borders or
          decorations of any kind.  If implementing your own theme, this is your starting point.<br />
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config2" popoverTitle="Config" placement="right" container="body">Show Config</button>
          <ng-template #config2>
            <pre>
              &lt;hci-grid [data]="data2"
                       [columns]="columns"
                       [theme]="''"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "lastName", name: "Last"
              field: "firstName", name: "First"
              field: "dob", name: "Birth Date", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
              field: "nLabs", name: "# Labs"
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data2"
                    [columns]="columns"
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
        <div class="card-text">
          A reporting theme designed to look more like a row/column layout in a pdf rather than a spreadsheet.  Special
          view renderers can be added to provide some flare.  In this case we color text and add an icon if number values
          are outside of a range.<br />
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config3" popoverTitle="Config" placement="right" container="body">Show Config</button>
          <ng-template #config3>
            <pre>
              &lt;hci-grid [title]="'Demographics Report'"
                        [data]="data3"
                        [columns]="columns3"
                        [theme]="'report'"
                        [nVisibleRows]="-1"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "lastName", name: "Last"
              field: "firstName", name: "First"
              field: "dob", name: "Birth Date", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
              field: "nLabs", name: "# Labs", viewRenderer: CellNumberRangeView, viewConfig: {{"{"}}low: 15, high: 85, showIcon: true{{"}"}}
            </pre>
          </ng-template>
        </div>
        <div class="card-text">
          <hci-grid [title]="'Demographics Report'"
                    [data]="data3"
                    [columns]="columns3"
                    [theme]="'report'"
                    [nVisibleRows]="-1">
          </hci-grid>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>Override Theme</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Take an existing theme and in your app's css, override specific parts.  In this case, change coloring of the
          report theme.<br />
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config4" popoverTitle="Config" placement="right" container="body">Show Config</button>
          <ng-template #config4>
            <pre>
              &lt;hci-grid
                [title]="'Demographics Report'"
                [data]="data4"
                [columns]="columns3"
                [theme]="'report override'"
                [nVisibleRows]="-1"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "lastName", name: "Last"
              field: "firstName", name: "First"
              field: "dob", name: "Birth Date", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
              field: "nLabs", name: "# Labs", viewRenderer: CellNumberRangeView, viewConfig: {{"{"}}low: 20, high: 80, showIcon: true{{"}"}}
              
              #gridContainer.report.override #titleBar {{"{"}}
                border-bottom: red 2px solid !important;
              {{"}"}}
          
              #gridContainer.report.override #headerContent {{"{"}}
                border-bottom: blue 1px solid !important;;
              {{"}"}}
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Demographics Report'"
                    [data]="data4"
                    [columns]="columns3"
                    [theme]="'report override'"
                    [nVisibleRows]="-1">
          </hci-grid>
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>New Theme</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Creating our own theme which makes the font larger.<br />
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="newTheme" popoverTitle="Config" placement="right" container="body">Show Config</button>
          <ng-template #newTheme>
            <pre>
              &lt;hci-grid
                [title]="'Demographics Report'"
                [data]="data5"
                [columns]="columns"
                [theme]="'big'"
                [nVisibleRows]="-1"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "lastName", name: "Last"
              field: "firstName", name: "First"
              field: "dob", name: "Birth Date", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
              field: "nLabs", name: "# Labs"
              
              #gridContainer.big {{"{"}}
                font-family: Arial;
                font-size: 20px;
                font-style: italic;
                font-weight: 100;
              {{"}"}}
              
              #gridContainer.big .hci-grid-row.even {{"{"}}
                color: gray;
              {{"}"}}
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Demographics Report'"
                    [data]="data5"
                    [columns]="columns"
                    [theme]="'big'"
                    [nVisibleRows]="-1">
          </hci-grid>
        </p>
      </div>
    </div>
  `,
  styles: [`

    #grid-container.report.override #title-bar {
      border-bottom: red 2px solid !important;
    }

    #grid-container.report.override #header-content {
      border-bottom: blue 1px solid !important;;
    }

  `],
  encapsulation: ViewEncapsulation.None
})
export class ThemingComponent {

  @HostBinding("class") classList: string = "demo-component";

  selectedRowID: number;

  listeners1: Array<any> = [
    { type: ClickViewListener }
  ];

  data1: Object[] = [];
  data2: Object[] = [];
  data3: Object[] = [];
  data4: Object[] = [];
  data5: Object[] = [];

  columns: any[] = [
    { field: "lastName", name: "Last" },
    { field: "firstName", name: "First" },
    { field: "dob", name: "Birth Date", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "address", name: "Address" },
    { field: "nLabs", name: "# Labs" }
  ];

  columns1: any[] = [
    { field: "idPatient", name: "ID" },
    { field: "lastName", name: "Last Name" },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "nLabs", name: "# Labs", dataType: "number" },
    { viewRenderer: ClickView, minWidth: 30, width: 30, maxWidth: 30 }
  ];

  columns3: any[] = [
    { field: "lastName", name: "Last" },
    { field: "firstName", name: "First" },
    { field: "dob", name: "Birth Date", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "address", name: "Address" },
    { field: "path.nPath", name: "# Labs", viewRenderer: CellNumberRangeView, viewConfig: {low: 20, high: 80, showIcon: true} }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data1 = this.dataGeneratorService.getData(11);
    this.data2 = this.dataGeneratorService.getData(6);
    this.data3 = this.dataGeneratorService.getData(17);
    this.data4 = this.dataGeneratorService.getData(3);
    this.data5 = this.dataGeneratorService.getData(5);
  }

  rowClick(event: any) {
    this.selectedRowID = +event;
  }
}
