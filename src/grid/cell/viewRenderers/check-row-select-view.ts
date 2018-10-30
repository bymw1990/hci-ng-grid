import {Renderer2} from "@angular/core";

import {Column} from "../../column/column";
import {CellViewRenderer} from "./cell-view-renderer.interface";

export class CheckRowSelectView implements CellViewRenderer {

  checkedIcon: string = "fas fa-check-square";
  uncheckedIcon: string = "far fa-times-circle";

  updateColumn(column: Column) {
    column.editable = false;
  }

  setConfig(config: any) {
    if (config.checkedIcon) {
      this.checkedIcon = config.checkedIcon;
    }
    if (config.uncheckedIcon) {
      this.uncheckedIcon = config.uncheckedIcon;
    }
  }

  createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number): HTMLElement {
    let classes: string[] = [];

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
    renderer.addClass(selectedSpan, "row-selected-icon");
    renderer.appendChild(span, selectedSpan);

    let selectedSvg = renderer.createElement("span");
    renderer.addClass(selectedSvg, "fa-lg");
    renderer.appendChild(selectedSpan, selectedSvg);
    classes = this.checkedIcon.split(" ");
    for (let iconClass of classes) {
      renderer.addClass(selectedSvg, iconClass);
    }

    let unselectedSpan = renderer.createElement("span");
    renderer.addClass(unselectedSpan, "row-unselected-icon");
    renderer.appendChild(span, unselectedSpan);

    let unselectedSvg = renderer.createElement("span");
    renderer.addClass(selectedSvg, "fa-lg");
    renderer.appendChild(unselectedSpan, unselectedSvg);
    classes = this.uncheckedIcon.split(" ");
    for (let iconClass of classes) {
      renderer.addClass(selectedSvg, iconClass);
    }


    renderer.appendChild(span, unselectedSpan);
    return span;
  }
}
