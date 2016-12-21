import { Component, ViewEncapsulation } from "@angular/core";

import { Column, DateCell, LabelCell } from "hci-ng-grid/index";

@Component({
    selector: "style-grid",
    template: `
    <div style="padding: 20px;">
      <h2>New Row Colors</h2>
    </div>
    <div style="padding: 20px;">
      Here we change the color of the odd and even rows.
    </div>
    <div style="padding: 20px;">
      <hci-grid [inputData]="styleData1"
                [columnDefinitions]="styleColumns1"
                class="grid1">
      </hci-grid>
    </div>
    <div style="padding: 20px;">
      <h2>Cell Select Colors</h2>
    </div>
    <div style="padding: 20px;">
      Here we change the default colors for the cell selection.
    </div>
    <div style="padding: 20px;">
      <hci-grid [inputData]="styleData2"
                [columnDefinitions]="styleColumns2"
                [cellSelect]="true"
                class="grid2">
      </hci-grid>
    </div>
    <div style="padding: 20px;">
      <h2>Bigger Rows and Bigger Font</h2>
    </div>
    <div style="padding: 20px;">
      Here we override the row height to 45px and change the font family and size.
    </div>
    <div style="padding: 20px;">
      <hci-grid [inputData]="styleData3"
                class="grid3">
      </hci-grid>
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
        { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
        { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
        { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
        { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
        { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
        { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
    ];

    styleColumns1: Column[] = [
        new Column({ field: "idPatient", name: "ID", template: LabelCell, visible: false }),
        new Column({ field: "lastName", name: "Last Name", template: LabelCell }),
        new Column({ field: "firstName", name: "First Name", template: LabelCell }),
        new Column({ field: "dob", name: "Date of Birth", template: DateCell }),
        new Column({ field: "pcg.nLabs", name: "# Labs", template: LabelCell }),
        new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path", template: LabelCell })
    ];

    styleData2: Array<Object> = [
        { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
        { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
        { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
        { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
        { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
        { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
    ];

    styleColumns2: Column[] = [
        new Column({ field: "lastName", template: LabelCell }),
        new Column({ field: "firstName", template: LabelCell }),
        new Column({ field: "dob", template: DateCell }),
        new Column({ field: "pcg.nLabs", template: LabelCell }),
        new Column({ field: "pcg.nested.nLabPath", template: LabelCell })
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
