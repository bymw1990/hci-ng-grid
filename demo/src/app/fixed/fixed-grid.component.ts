import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column, LabelCell, InputCell, DateCell } from "hci-ng2-grid/index";

@Component({
  selector: "fixed-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Fixed Grid</h2>
    </div>
    <div style="padding: 20px;">
      <div>&lt;tab&gt; through cells</div>
      <div>click on cells</div>
      <div>up/down/left/right on selected cell</div>
      <div>modify input cell values and check bound data changes</div>
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Fixed Grid'"
                [inputData]="fixedData"
                [columnDefinitions]="fixedColumns"
                [key]="[idPatient]"
                [fixedColumns]="['firstName', 'lastName']"
                [externalFiltering]="true"
                (onExternalFilter)="callExternalFilter()">
      </hci-grid>
    </div>
    <div style="padding: 20px;">
      <span style="font-weight: bold;">Bound Data</span>
      <div style="font-weight: bold;">
        <span style="width: 100px; display: inline-block;">idPatient</span>
        <span style="width: 100px; display: inline-block;">firstName</span>
        <span style="width: 100px; display: inline-block;">middleName</span>
        <span style="width: 100px; display: inline-block;">lastName</span>
        <span style="width: 150px; display: inline-block;">dob</span>
        <span style="width: 150px; display: inline-block;">gender</span>
        <span style="width: 150px; display: inline-block;">address</span>
        <span style="width: 150px; display: inline-block;">phone</span>
      </div>
      <div *ngFor="let row of fixedData">
        <span style="width: 100px; display: inline-block;">{{row.idPatient}}</span>
        <span style="width: 100px; display: inline-block;">{{row.firstName}}</span>
        <span style="width: 100px; display: inline-block;">{{row.middleName}}</span>
        <span style="width: 100px; display: inline-block;">{{row.lastName}}</span>
        <span style="width: 150px; display: inline-block;">{{row.dob}}</span>
        <span style="width: 100px; display: inline-block;">{{row.gender}}</span>
        <span style="width: 150px; display: inline-block;">{{row.address}}</span>
        <span style="width: 150px; display: inline-block;">{{row.phone}}</span>
      </div>
    </div>
    `
})
export class FixedGridComponent {

  fixedData: Array<Object>;

  fixedColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: LabelCell, visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: InputCell }),
    new Column({ field: "middleName", name: "Middle Name", template: InputCell }),
    new Column({ field: "firstName", name: "First Name", template: InputCell }),
    new Column({ field: "dob", name: "Date of Birth", template: DateCell }),
    new Column({ field: "gender", name: "Gender", template: LabelCell }),
    new Column({ field: "address", name: "Address", template: LabelCell, minWidth: 300 }),
    new Column({ field: "citystatezip", name: "City, State Zip", template: LabelCell, minWidth: 300 }),
    new Column({ field: "phone", name: "Phone", template: InputCell })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.dataGeneratorService.generateFixedData(100);
    this.fixedData = this.dataGeneratorService.getFixedData(null, null, null);
  }

  /*fixedData: Array<Object> = [
    { "idPatient": 1, "firstName": "Zane", "lastName": "Zoe", "dob": 111110000000, "middleName": "C", "gender": "Female", "address": "111 Spooner St", "phone": "7131110005", "citystatezip": "Salt Lake City, UT 84000" },
    { "idPatient": 2, "firstName": "Rick", "lastName": "James", "dob": 321110000000, "middleName": "", "gender": "Male", "address": "123 Wood Ln", "phone": "7132220006", "citystatezip": "Salt Lake City, UT 84000" },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "middleName": "B", "gender": "Other", "address": "1555 E 800 S", "phone": "71354440007", "citystatezip": "Walla Walla, WA 24000" },
    { "idPatient": 4, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "middleName": "Z", "gender": "Male", "address": "1 N Canyon Rd", "phone": "7136660008", "citystatezip": "Kukamunga, WA 22000" },
    { "idPatient": 5, "firstName": "Bob", "lastName": "Smith", "dob": 51110000000, "middleName": "A", "gender": "Male", "address": "742 Evergreen Terace", "phone": "7135550001", "citystatezip": "Seattle, WA 55500" },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 741110000000, "middleName": "", "gender": "Male", "address": "9 S Canyon Rd", "phone": "7137770009", "citystatezip": "Perfection, NV 77777" }
  ];*/

  callExternalFilter() {
    console.log("DemoAppComponent.callExternalFilter");
  }
}
