import {Renderer2} from "@angular/core";

import {CellViewRenderer} from "./cell-view-renderer.interface";
import {Column} from "../../column/column";

export class CellNumberRangeView implements CellViewRenderer {

  low: number;
  high: number;

  lowColor: string = "red";
  highColor: string = "green";

  showIcon: boolean = false;

  updateColumn(column: Column) {}

  setConfig(config: any) {
    this.lowColor = "red";
    this.highColor = "green";
    this.showIcon = false;

    if (config.low) {
      this.low = config.low;
    }
    if (config.high) {
      this.high = config.high;
    }
    if (config.lowColor) {
      this.lowColor = config.lowColor;
    }
    if (config.highColor) {
      this.highColor = config.highColor;
    }
    if (config.showIcon !== undefined) {
      this.showIcon = config.showIcon;
    }
  }

  createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number): HTMLElement {
    let div = renderer.createElement("div");
    let span1 = renderer.createElement("span");
    let span2 = renderer.createElement("span");
    let text = renderer.createText(column.formatValue(value));
    renderer.appendChild(div, span1);
    renderer.appendChild(div, span2);
    renderer.appendChild(span1, text);

    renderer.setStyle(span1, "width", "25px");
    renderer.setStyle(span1, "display", "inline-flex");

    let v: number = null;
    try {
      v = +value;

      if (this.low && this.high) {
        if (v < this.low) {
          renderer.setStyle(div, "color", this.lowColor);
          renderer.addClass(span2, "fas");
          renderer.addClass(span2, "fa-arrow-alt-circle-down");
        } else if (v >= this.high) {
          renderer.setStyle(div, "color", this.highColor);
          renderer.addClass(span2, "fas");
          renderer.addClass(span2, "fa-arrow-alt-circle-up");
        }
      }
    } catch (e) {
      //
    }

    return div;
  }
}
