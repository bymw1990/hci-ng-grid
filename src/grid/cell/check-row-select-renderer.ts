import {Renderer2} from "@angular/core";

import {Column} from "../column/column";
import {Cell} from "../cell/cell";

export class CheckRowSelectRenderer {
  createCell(renderer: Renderer2, column: Column, cell: Cell): HTMLElement {
    let span = renderer.createElement("span");
    renderer.setAttribute(span, "id", "row-select");
    renderer.setStyle(span, "display", "inherit");
    renderer.setStyle(span, "text-align", "center");
    renderer.setStyle(span, "vertical-align", "middle");
    renderer.addClass(span, "row-select");

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