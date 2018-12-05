import {Renderer2} from "@angular/core";

import {CellViewRenderer} from "./cell-view-renderer.interface";
import {Column} from "../../column/column";

export class CellTextView implements CellViewRenderer {

  column: Column;

  updateColumn(column: Column) {
    this.column = column;

    console.debug("updateColumn");
    console.debug(column.choiceMap);
  }

  setConfig(config: any) {}

  createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number): HTMLElement {
    let span = renderer.createElement("span");
    renderer.setStyle(span, "padding-left", "8px");
    renderer.setStyle(span, "margin-top", "auto");
    renderer.setStyle(span, "margin-bottom", "auto");
    renderer.setStyle(span, "overflow-x", "hidden");
    renderer.setStyle(span, "text-overflow", "ellipsis");

    let text = undefined;
    if (this.column.dataType === "choice") {
      text = renderer.createText(this.getChoice(value));
    } else {
      text = renderer.createText(column.formatValue(value));
    }
    renderer.appendChild(span, text);
    return span;
  }

  getChoice(value: any): any {
    let display: any = this.column.choiceMap.get(value);

    return (display) ? display : "";
  }
}
