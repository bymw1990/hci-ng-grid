import {Renderer2} from "@angular/core";

import {CellViewRenderer} from "./cell-view-renderer.interface";
import {Column} from "../../column/column";

export class CellCheckView implements CellViewRenderer {

  id: string;
  appendLocation: boolean;
  column: Column;

  updateColumn(column: Column) {
    this.column = column;
  }
  
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
  }

  createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number): HTMLElement {
    let input = renderer.createElement("input");
    renderer.setAttribute(input,"type","checkbox");
    renderer.setAttribute(input,"value",value);
    if (this.appendLocation) {
        renderer.setAttribute(input, "id", this.id + "-" + i + "-" + j);
    } else {
        renderer.setAttribute(input, "id", this.id);
    }
    if (column.choiceValue === value) {
        renderer.setAttribute(input,"checked","checked");
    }
    if (column.clickable === false) {
        renderer.setProperty(input, "disabled", "disabled");
    }
    renderer.setStyle(input, "margin-left", "8px");
    renderer.setStyle(input, "margin-top", "auto");
    renderer.setStyle(input, "margin-bottom", "auto");
    renderer.setStyle(input, "overflow-x", "hidden");
   
    return input;
  }

 
}
