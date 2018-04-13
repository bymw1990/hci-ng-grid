import {Renderer2} from "@angular/core";

import {Column} from "../../column/column";
import {CellViewRenderer} from "./cell-view-renderer.interface";

export class ClickView implements CellViewRenderer {

  id: string;
  appendLocation: boolean;
  icon: string;
  style: string;

  updateColumn(column: Column) {}

  setConfig(config: any) {
    if (!config) {
      return;
    }

    if (config.id) {
      this.id = config.id;
    } else {
      this.id = "click";
    }

    if (config.appendLocation !== undefined) {
      this.appendLocation = config.appendLocation;
    } else {
      this.appendLocation = true;
    }

    if (config.icon) {
      this.icon = config.icon;
    } else {
      this.icon = "fas fa-chevron-circle-right fa-lg";
    }

    if (config.style) {
      this.style = config.style;
    } else {
      this.style = "color: green;";
    }
  }

  createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number): HTMLElement {
    let span = renderer.createElement("span");
    if (this.appendLocation) {
      renderer.setAttribute(span, "id", this.id + "-" + i + "-" + j);
    } else {
      renderer.setAttribute(span, "id", this.id);
    }
    renderer.setStyle(span, "margin-top", "auto");
    renderer.setStyle(span, "margin-bottom", "auto");
    renderer.setStyle(span, "margin-left", "auto");
    renderer.setStyle(span, "margin-right", "auto");

    if (this.style) {
      let styles: string[] = this.style.split(";");
      for (let style of styles) {
        if (style.indexOf(":") > 0) {
          let x: number = style.indexOf(":");
          let k: string = style.substr(0, x);
          let v: string = style.substr(x + 1);
          if (k && v && k.length > 0 && v.length > 0) {
            renderer.setStyle(span, k.trim(), v.trim());
          }
        }
      }
    }

    let eIcon = renderer.createElement("i");
    let classes: string[] = this.icon.split(" ");
    for (let iClass of classes) {
      renderer.addClass(eIcon, iClass);
    }
    renderer.appendChild(span, eIcon);

    return span;
  }
}