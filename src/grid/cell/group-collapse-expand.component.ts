import { Component, ViewEncapsulation } from "@angular/core";

import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "hci-grid-cell-group-expand-collapse",
  styles: [ `
    .hci-cell-gce {
      height: 100%;
      padding-top: 3px;
    }
  `],
  template: `
    <span *ngIf="render" class="hci-grid-cell-template hci-cell-gce" [ngClass]="{ 'focused': focused }">
      +/-
    </span>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class GroupCollapseExpandCell extends CellTemplate {

  render: boolean = false;
  activeOnRowHeader: boolean = true;
  valueable: boolean = false;

}
