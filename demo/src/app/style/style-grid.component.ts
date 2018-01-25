import { Component, ViewEncapsulation } from "@angular/core";

import { Column } from "hci-ng-grid/index";

@Component({
    selector: "style-grid",
    template: `
      <div class="card">
        <div class="card-header">
          <h4>New Row Colors</h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            Here we change the color of the odd and even rows.
          </p>
          <p>
            <hci-grid [inputData]="styleData1"
                      [columnDefinitions]="styleColumns1"
                      class="grid1">
            </hci-grid>
          </p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h4>Cell Select Colors</h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            Here we change the default colors for the cell selection.
          </p>
          <p>
            <hci-grid [inputData]="styleData2"
                      [columnDefinitions]="styleColumns2"
                      [cellSelect]="true"
                      class="grid2">
            </hci-grid>
          </p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h4>Bigger Rows and Bigger Font</h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            Here we override the row height to 45px and change the font family and size.
          </p>
          <p>
            <hci-grid [inputData]="styleData3"
                      class="grid3">
            </hci-grid>
          </p>
        </div>
      </div>
    `,
    styles: [ `
    
      .grid1 .hci-grid-row-even {
        background-color: #eeffee;
      }
      .grid1 .hci-grid-row-odd {
        background-color: #eeeeff;
      }
      
      .grid2 .hci-grid-cell-template.focused {
        background-color: #ffeeee;
      }
      
      .grid3 .hci-grid-row-height {
        height: 45px;
      }
      .grid3 {
        font-family: cursive;
        font-size: larger;
      }
      .grid3 .hci-grid-cell-parent {
        margin-top: 8px;
      }
    
    ` ],
    encapsulation: ViewEncapsulation.None
})
export class StyleGridComponent {

    styleData1: Array<Object> = [
        { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1971-01-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
        { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1972-11-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
        { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1973-12-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
        { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1945-12-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
        { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1947-01-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
        { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1958-11-11T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
    ];

    styleColumns1: Column[] = [
        new Column({ field: "idPatient", name: "ID", template: "LabelCell", visible: false }),
        new Column({ field: "lastName", name: "Last Name", template: "LabelCell" }),
        new Column({ field: "firstName", name: "First Name", template: "LabelCell" }),
        new Column({ field: "dob", name: "Date of Birth", template: "DateCell" }),
        new Column({ field: "pcg.nLabs", name: "# Labs", template: "LabelCell" }),
        new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path", template: "LabelCell" })
    ];

    styleData2: Array<Object> = [
        { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1967-01-12T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
        { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1956-03-13T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
        { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1945-04-15T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
        { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1935-05-17T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
        { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1967-06-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
        { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1977-07-25T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
    ];

    styleColumns2: Column[] = [
        new Column({ field: "lastName", template: "LabelCell" }),
        new Column({ field: "firstName", template: "LabelCell" }),
        new Column({ field: "dob", template: "DateCell" }),
        new Column({ field: "pcg.nLabs", template: "LabelCell" }),
        new Column({ field: "pcg.nested.nLabPath", template: "LabelCell" })
    ];

    styleData3: Array<Object> = [
        { "idPatient": 1, "firstName": "Bob", "lastName": "Smith" },
        { "idPatient": 2, "firstName": "Jane", "lastName": "Doe" },
        { "idPatient": 3, "firstName": "Rick", "lastName": "James" },
        { "idPatient": 4, "firstName": "Rick", "lastName": "James"},
        { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth" },
        { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne" }
    ];

}
