import {Component, ViewEncapsulation} from "@angular/core";
import {Column, CellNumberRangeView, ClickView, ClickViewListener, EventListenerArg} from "hci-ng-grid/index";
import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "style-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Excel (default) Theme</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          This is the default theme which borders every cell.<br />
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid [data]="data1"
                       [columnDefinitions]="columns"
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
                    [columnDefinitions]="columns"
                    [pageSize]="10"
                    [pageSizes]="[5, 10, 25]">
          </hci-grid>
        </p>
      </div>
    </div>

<div class="card">
      <div class="card-header">
        <h4>Core Default Theme</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          A variation of the Excel theme.<br />
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config3" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config3>
            <pre>
              &lt;hci-grid [title]="'Core Default styled'"
                        [data]="data1"
                        [columnDefinitions]="columns1"
                        [eventListeners]="listeners1"
                        (rowClick)="rowClick($event)"
                        [theme]="'coredefault'"
                        [pageSize]="10"
                        [pageSizes]="[5, 10, 25]"&gt;
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
                    [data]="data1"
                    [columnDefinitions]="columns1"
                    [eventListeners]="listeners1"   
                    (rowClick)="rowClick($event)"                 
                    [theme]="'coredefault'"
                    [pageSize]="10"
                    [pageSizes]="[5, 10, 25]">
          </hci-grid>
        </div>
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
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config2" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config2>
            <pre>
              &lt;hci-grid [data]="data2"
                       [columnDefinitions]="columns"
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
        <div class="card-text">
          A reporting theme designed to look more like a row/column layout in a pdf rather than a spreadsheet.  Special
          view renderers can be added to provide some flare.  In this case we color text and add an icon if number values
          are outside of a range.<br />
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config3" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config3>
            <pre>
              &lt;hci-grid [title]="'Demographics Report'"
                        [data]="data3"
                        [columnDefinitions]="columns3"
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
                    [columnDefinitions]="columns3"
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
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config4" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config4>
            <pre>
              &lt;hci-grid
                [title]="'Demographics Report'"
                [data]="data4"
                [columnDefinitions]="columns3"
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
                    [columnDefinitions]="columns3"
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
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="newTheme" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #newTheme>
            <pre>
              &lt;hci-grid
                [title]="'Demographics Report'"
                [data]="data5"
                [columnDefinitions]="columns"
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
                    [columnDefinitions]="columns"
                    [theme]="'big'"
                    [nVisibleRows]="-1">
          </hci-grid>
        </p>
      </div>
    </div>
  `,
  styles: [`

    #gridContainer.report.override #titleBar {
      border-bottom: red 2px solid !important;
    }

    #gridContainer.report.override #headerContent {
      border-bottom: blue 1px solid !important;;
    }

  `],
  encapsulation: ViewEncapsulation.None
})
export class ThemingComponent {

  selectedRowID: number;
    
  listeners1: Array<any> = [
    { type: ClickViewListener }
  ];
    
  data1: Array<Object> = [];
  data2: Array<Object> = [];
  data3: Array<Object> = [];
  data4: Array<Object> = [];
  data5: Array<Object> = [];

  columns: Column[] = [
    new Column({ field: "lastName", name: "Last" }),
    new Column({ field: "firstName", name: "First" }),
    new Column({ field: "dob", name: "Birth Date", dataType: "date" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "address", name: "Address" }),
    new Column({ field: "nLabs", name: "# Labs" })
  ];
    
  columns1: Column[] = [
    new Column({ field: "idPatient", name: "ID" }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "middleName", name: "Middle Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "nLabs", name: "# Labs", dataType: "number" }),
    new Column({ viewRenderer: ClickView, minWidth: 30, width: 30, maxWidth: 30 })
  ];

  columns3: Column[] = [
    new Column({ field: "lastName", name: "Last" }),
    new Column({ field: "firstName", name: "First" }),
    new Column({ field: "dob", name: "Birth Date", dataType: "date" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "address", name: "Address" }),
    new Column({ field: "nLabs", name: "# Labs", viewRenderer: CellNumberRangeView, viewConfig: {low: 20, high: 80, showIcon: true} })
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
