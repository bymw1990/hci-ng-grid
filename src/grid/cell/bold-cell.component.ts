import { Component } from "@angular/core";
import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "bold-cell",
  template: `
    <span style="font-weight: bold;" class="grid-cell-template">{{value}}</span>
  `
})
export class BoldCell extends CellTemplate {

}
