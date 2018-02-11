import {Renderer2} from "@angular/core";

import {Column} from "../column/column";
import {Cell} from "../cell/cell";

export class CheckRowSelectRenderer {
  createCell(renderer: Renderer2, column: Column, cell: Cell): HTMLElement {
    let span = renderer.createElement("span");
    renderer.setAttribute(span, "id", "row-select");

    let check = renderer.createElement("span");
    renderer.addClass(check, "fas");
    renderer.addClass(check, "fa-lg");

    if (<boolean>cell.value) {
      renderer.setStyle(check, "color", "green");
      renderer.addClass(check, "fa-check-square");
    } else {
      renderer.setStyle(check, "color", "red");
      renderer.addClass(check, "fa-window-close");
    }

    renderer.appendChild(span, check);
    return span;
  }
}