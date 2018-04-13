import {CellViewRenderer} from "./cell-view-renderer.interface";
import {Renderer2} from "@angular/core";
import {Column} from "../../column/column";

export class CellTextView implements CellViewRenderer {

  updateColumn(column: Column) {}

  setConfig(config: any) {}

  createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number): HTMLElement {
    let span = renderer.createElement("span");
    renderer.setStyle(span, "padding-left", "8px");
    renderer.setStyle(span, "margin-top", "auto");
    renderer.setStyle(span, "margin-bottom", "auto");
    renderer.setStyle(span, "overflow-x", "hidden");
    renderer.setStyle(span, "text-overflow", "ellipsis");

    let text = renderer.createText(column.formatValue(value));
    renderer.appendChild(span, text);
    return span;
  }
}
