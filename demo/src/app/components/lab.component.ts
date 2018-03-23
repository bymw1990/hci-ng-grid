import {Component} from "@angular/core";

import {CellPopupRenderer} from "hci-ng-grid/index";

@Component({
  selector: "hci-lab-popup",
  template: `
    <div [id]="'popup-' + i + '-' + j" class="hci-lab-popup">
      <div style="padding: 5px;">
        <div class="lab-row">
          <span style="font-weight: bold; width: 75px;">Tech:</span><span>{{lab.tech}}</span>
        </div>
        <div class="lab-row">
          <span style="font-weight: bold; width: 75px;">Type:</span><span>{{lab.type}}</span>
        </div>
        <div class="lab-row">
          <span style="font-weight: bold; width: 75px;">Value:</span><span>{{lab.value}}</span>
        </div>
      </div>
    </div>
  `,
  styles: [ `
  
    .hci-lab-popup {
      background-color: rgba(0, 0, 255, 0.15);
      width: auto;
      border: black 1px solid;
      border-radius: 8px;
      white-space: normal;
      padding: 5px;
      box-shadow: 2px 2px rgba(0, 0, 0, 0.25);
    }
    
    .hci-lab-popup .lab-row {
      background-color: rgba(230, 230, 255, 1);
      border-radius: 6px;
      display: inline-flex;
      padding: 2px;
      padding-left: 4px;
      width: 100%;
    }
      
  `]
})
export class LabPopup extends CellPopupRenderer {

  lab: any;

  updateLocation() {
    this.lab = this.gridService.getRow(this.i).get(this.j).value;

    super.updateLocation();
  }
}
