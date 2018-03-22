import {Component} from "@angular/core";

import {CellPopupRenderer} from "./cell-popup-renderer";
import {Point} from "../../utils/point";

@Component({
  selector: "hci-bigtext-popup",
  template: `
    <div [id]="'popup-' + i + '-' + j" class="hci-bigtext-popup">
      {{formattedValue}}
    </div>
  `,
  styles: [ `
  
    .hci-bigtext-popup {
      background-color: white;
      width: 250px;
      border: black 1px solid;
      border-radius: 8px;
      white-space: normal;
      padding: 5px;
      box-shadow: 2px 2px rgba(0, 0, 0, 0.25);
    }
    
  `]
})
export class BigTextPopup extends CellPopupRenderer {

  formattedValue: string;

  updateLocation() {
    this.formattedValue = this.gridService.getColumn(this.j).formatValue(this.gridService.getRow(this.i).get(this.j).value);

    super.updateLocation();
  }
}
