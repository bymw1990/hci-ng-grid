import {CellViewRenderer} from "./cell-view-renderer.interface";
import {Renderer2} from "@angular/core";
import {Column} from "../../column/column";

export class CellTextView implements CellViewRenderer {

  setConfig(config: any) {}

  createElement(renderer: Renderer2, column: Column, value: any): HTMLElement {
    let text = renderer.createText(column.formatValue(value));
    return text;
  }
}
