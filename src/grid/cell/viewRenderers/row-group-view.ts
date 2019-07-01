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
    renderer.setStyle(div, "width", "inherit");

    if (rowGroup) {
      let spanCount = renderer.createElement("span");
      renderer.setStyle(spanCount, "margin-left", "0.5rem");
      renderer.setStyle(spanCount, "margin-right", "0.5rem");
      renderer.setStyle(spanCount, "flex-grow", "1");

      let icon = renderer.createElement("i");
      renderer.addClass(icon, "mr-1");
      renderer.appendChild(spanCount, icon);
      if (rowGroup.expanded) {
        renderer.addClass(icon, "fas");
        renderer.addClass(icon, "fa-level-up-alt");
        renderer.addClass(icon, "fa-flip-horizontal");
        renderer.appendChild(spanCount, renderer.createText("(" + rowGroup.count + ")"));
      } else {
        renderer.addClass(icon, "fas");
        renderer.addClass(icon, "fa-plus");
        renderer.appendChild(spanCount, renderer.createText("(" + rowGroup.count + ")"));
      }

      renderer.appendChild(div, spanCount);
    }

    let span = renderer.createElement("span");
    renderer.setStyle(span, "margin-left", "auto");
    renderer.setStyle(span, "margin-right", "0.5rem");
    renderer.setStyle(span, "overflow-x", "hidden");
    renderer.setStyle(span, "text-overflow", "ellipsis");

    renderer.appendChild(span, renderer.createText(value));
    renderer.appendChild(div, span);

    return div;
  }

  getChoice(value: any): any {
    let display: any = this.column.choiceMap.get(value);

    return (display) ? display : "";
  }
}
