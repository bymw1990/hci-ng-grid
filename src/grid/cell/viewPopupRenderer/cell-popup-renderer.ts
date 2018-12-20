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
    this.renderer.setStyle(this.elementRef.nativeElement, "position", "absolute");
    this.renderer.setStyle(this.elementRef.nativeElement, "height", this.hostElement.offsetHeight + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "z-index", "200");

    let wHost: number = this.hostElement.offsetWidth;
    let mainContent: number = (<HTMLElement>this.hostElement.closest("#main-content")).offsetWidth;
    let xView: number = (<HTMLElement>this.hostElement.closest(".cell-view")).offsetLeft;
    let x: number = xView + this.hostElement.offsetLeft + this.hostElement.offsetWidth - 30;
    if (x + wHost > mainContent) {
      x = mainContent - wHost;
    }

    let sRightView: number = this.gridService.gridElement.querySelector("#right-view").scrollTop;
    this.renderer.setStyle(this.elementRef.nativeElement, "margin-top",
        (this.hostElement.offsetHeight + this.hostElement.parentElement.offsetTop - sRightView + 15) + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "margin-left", x + "px");
  }

}
