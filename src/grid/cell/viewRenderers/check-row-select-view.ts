import {Renderer2} from "@angular/core";

import {Column} from "../../column/column";
import {CellViewRenderer} from "./cell-view-renderer.interface";

export class CheckRowSelectView implements CellViewRenderer {

  updateColumn(column: Column) {
    column.editable = false;
  }

  setConfig(config: any) {
    // None
  }

  createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number): HTMLElement {
    let span = renderer.createElement("span");
    renderer.setAttribute(span, "id", "row-select-" + i + "-" + j);
    renderer.setStyle(span, "margin-top", "auto");
    renderer.setStyle(span, "margin-bottom", "auto");
    renderer.setStyle(span, "margin-left", "auto");
    renderer.setStyle(span, "margin-right", "auto");
    renderer.addClass(span, "row-select");
    if (<boolean>value) {
      renderer.addClass(span, "selected");
    }

    let selectedSpan = renderer.createElement("span");
    renderer.addClass(selectedSpan, "selected-span");
    renderer.appendChild(span, selectedSpan);

    let selectedSvg = renderer.createElement("span");
    renderer.addClass(selectedSvg, "fas");
    renderer.setStyle(selectedSvg, "color", "green");
    renderer.addClass(selectedSvg, "fa-check-square");
    renderer.addClass(selectedSvg, "fa-lg");
    renderer.appendChild(selectedSpan, selectedSvg);

    let unselectedSpan = renderer.createElement("span");
    renderer.addClass(unselectedSpan, "unselected-span");
    renderer.appendChild(span, unselectedSpan);

    let unselectedSvg = renderer.createElement("span");
    renderer.addClass(unselectedSvg, "far");
    renderer.setStyle(unselectedSvg, "color", "rgba(255, 0, 0, 0.2)");
    renderer.addClass(unselectedSvg, "fa-times-circle");
    renderer.addClass(selectedSvg, "fa-lg");
    renderer.appendChild(unselectedSpan, unselectedSvg);

    renderer.appendChild(span, unselectedSpan);
    return span;
  }
}
