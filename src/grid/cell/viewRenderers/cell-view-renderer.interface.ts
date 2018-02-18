import {Renderer2} from "@angular/core";
import {Column} from "../../column/column";

export interface CellViewRenderer {

  setConfig(config: any);

  createElement(renderer: Renderer2, column: Column, value: any): HTMLElement;
}
