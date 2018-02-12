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

    let check = renderer.createElement("span");
    renderer.addClass(check, "fa-lg");

    if (<boolean>cell.value) {
      renderer.addClass(check, "fas");
      renderer.setStyle(check, "color", "green");
      renderer.addClass(check, "fa-check-square");
    } else {
      renderer.addClass(check, "far");
      renderer.setStyle(check, "color", "rgba(255, 0, 0, 0.2)");
      renderer.addClass(check, "fa-times-circle");
    }

    renderer.appendChild(span, check);
    return span;
  }
}