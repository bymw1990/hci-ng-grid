import {ChangeDetectorRef, ElementRef, Renderer2} from "@angular/core";

import {GridService} from "../../services/grid.service";
import {Point} from "../../utils/point";

/**
 * This base component is designed to show additional information of a cell.  There are two basic examples in mind.
 * First, a cell could contain a lot of text that overflows the cell.  On hover, this popup can show the full
 * content.  Secondly, a cell could represent a complex object with only one particular value shown in the cell.
 * This popup could show additional data.
 */
export class CellPopupRenderer {

  i: number;
  j: number;

  gridService: GridService;
  elementRef: ElementRef;
  renderer: Renderer2;
  changeDetectorRef: ChangeDetectorRef;

  private hostElement: HTMLElement;

  constructor(gridService: GridService, elementRef: ElementRef, renderer: Renderer2, changeDetectorRef: ChangeDetectorRef) {
    this.gridService = gridService;
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.changeDetectorRef = changeDetectorRef;
  }

  setConfig(config: any) {}

  setPosition(location: Point) {
    this.i = location.i;
    this.j = location.j;
  }

  setLocation(hostElement: HTMLElement) {
    this.hostElement = hostElement;
    this.updateLocation();
  }

  /**
   * Correctly position the editor popup over the selected cell.
   */
  updateLocation() {
    this.renderer.addClass(this.elementRef.nativeElement, "cell-popup");
    this.renderer.setStyle(this.elementRef.nativeElement, "position", "fixed");
    this.renderer.setStyle(this.elementRef.nativeElement, "z-index", "2000");

    let hostRect = this.hostElement.getBoundingClientRect();
    let left: number = (hostRect.left + 15);
    let top: number = (hostRect.top + 15);

    if (left + this.hostElement.offsetWidth > document.body.offsetWidth) {
      left = document.body.offsetWidth - this.hostElement.offsetWidth;
    }
    if (top + this.hostElement.offsetHeight > document.body.offsetHeight) {
      top = document.body.offsetHeight - this.hostElement.offsetHeight;
    }

    this.renderer.setStyle(this.elementRef.nativeElement, "left", left + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "top", top + "px");
  }

}
