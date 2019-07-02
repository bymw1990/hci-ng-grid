import {Component, HostBinding} from "@angular/core";

import {DataGeneratorService} from "../services/data-generator.service";
import {delay} from "rxjs/operators";
import {Observable, of} from "rxjs/index";
import {HciDataDto, HciGridDto} from "hci-ng-grid-dto";

@Component({
  selector: "group-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Row Grouping without Paging</h4>
      </div>
      <div class="card-body">
        <div class="card-text input-row">
          <input [ngModel]="dataSize" (ngModelChange)="setDataSize($event)" />
          <a class="btn btn-primary gap" (click)="generateData()">Re-generate Data</a>
        </div>
        <div class="card-text">
          Create a new column that is an aggregate of other columns.  In this case first and last name.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right" container="body">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [title]="'Group Grid'"
                [data]="groupData"
                [columns]="groupColumns"
                [groupBy]="['lastName']"
                [pageSize]="10"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
              field: "phone", name: "Phone"
            </pre>
          </ng-template>
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="bound1" popoverTitle="Bound Data" placement="right" container="body">Show Bound Data</button>
          <ng-template #bound1>
            <div class="d-flex flex-nowrap" style="font-weight: bold;">
              <span style="width: 100px;">idPatient</span>
              <span style="width: 100px;">firstName</span>
              <span style="width: 100px;">middleName</span>
              <span style="width: 100px;">lastName</span>
              <span style="width: 150px;">dob</span>
              <span style="width: 150px;">gender</span>
              <span style="width: 150px;">address</span>
              <span style="width: 150px;">phone</span>
            </div>
            <div *ngFor="let row of groupData" class="d-flex flex-nowrap">
              <span style="width: 100px;">{{row.idPatient}}</span>
              <span style="width: 100px;">{{row.firstName}}</span>
              <span style="width: 100px;">{{row.middleName}}</span>
              <span style="width: 100px;">{{row.lastName}}</span>
              <span style="width: 150px;">{{row.dob}}</span>
              <span style="width: 100px;">{{row.gender}}</span>
              <span style="width: 150px;">{{row.address}}</span>
              <span style="width: 150px;">{{row.phone}}</span>
            </div>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data1"
                    [columns]="columns1"
                    [groupBy]="['lastName']"
                    [nVisibleRows]="10">
          </hci-grid>
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>Row Grouping with Paging</h4>
      </div>
      <div class="card-body">
        <hci-grid [data]="data1"
                  [columns]="columns1"
                  [groupBy]="['lastName']"
                  [pageSize]="10">
        </hci-grid>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>Row Grouping with External Data</h4>
      </div>
      <div class="card-body">
        <hci-grid [dataCall]="onExternalDataCall"
                  [columns]="columns1"
                  [groupBy]="['lastName']"
                  [externalGrouping]="true"
                  [pageSize]="10">
        </hci-grid>
      </div>
    </div>
  `,
  styles: [`
  
    .input-row {
      height: 40px;
      display: flex;
    }
    
    .gap {
      margin-left: 20px;
    }
    
  `]
})
export class RowGroupGridComponent {

  @HostBinding("class") classList: string = "demo-component";

  public onExternalDataCall: (externalInfo: HciGridDto) => Observable<HciDataDto>;

  dataSize: number = 25;

  data1: Object[] = [];

  columns1: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name" },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "address", name: "Address" },
    { field: "phone", name: "Phone" }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.generateData();
  }

  setDataSize(dataSize: number) {
    this.dataSize = dataSize;

    this.generateData();
  }

  generateData() {
    this.dataGeneratorService.generateExternalData1(this.dataSize);
    this.onExternalDataCall = this.handleExternalDataCall.bind(this);
    this.data1 = this.dataGeneratorService.getData(this.dataSize);
  }

  handleExternalDataCall(externalInfo: HciGridDto): Observable<HciDataDto> {
    return of(this.dataGeneratorService.getExternalData1(externalInfo)).pipe(delay(1000));
  }
}
