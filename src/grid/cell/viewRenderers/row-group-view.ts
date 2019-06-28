import {Renderer2} from "@angular/core";

import {CellViewRenderer} from "./cell-view-renderer.interface";
import {Column} from "../../column/column";
import {RowGroup} from "../../row/row-group";

export class RowGroupView implements CellViewRenderer {

  column: Column;

  updateColumn(column: Column) {
    this.column = column;
  }

  setConfig(config: any) {}

  createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number, rowGroup?: RowGroup): HTMLElement {
    let div = renderer.createElement("div");
    renderer.setStyle(div, "display", "flex");
    renderer.setStyle(div, "flex-grow", "1");
    renderer.setStyle(div, "align-items", "center");

    let span = renderer.createElement("span");
    renderer.setStyle(span, "padding-left", "0.5rem");
    renderer.setStyle(span, "margin-top", "auto");
    renderer.setStyle(span, "margin-bottom", "auto");
    renderer.setStyle(span, "overflow-x", "hidden");
    renderer.setStyle(span, "text-overflow", "ellipsis");
    renderer.setStyle(span, "flex-grow", "1");

    renderer.appendChild(span, renderer.createText(value));

    renderer.appendChild(div, span);

    if (rowGroup) {
      let spanCount = renderer.createElement("span");
      renderer.setStyle(spanCount, "margin-left", "auto");
      renderer.setStyle(spanCount, "margin-right", "0.5rem");
      if (rowGroup.expanded) {
        renderer.appendChild(spanCount, renderer.createText("- (" + rowGroup.count + ")"));
      } else {
        renderer.appendChild(spanCount, renderer.createText("+ (" + rowGroup.count + ")"));
      }

      renderer.appendChild(div, spanCount);
    }

    return div;
  }

  getChoice(value: any): any {
    let display: any = this.column.choiceMap.get(value);

    return (display) ? display : "";
  }
}
