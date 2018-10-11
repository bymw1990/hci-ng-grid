import {ChangeDetectorRef, ElementRef, HostListener, isDevMode, Renderer2} from "@angular/core";

import {Subject} from "rxjs/Subject";

import {Cell} from "../cell";
import {GridService} from "../../services/grid.service";
import {GridEventService} from "../../services/grid-event.service";
import {Column} from "../../column/column";

/**
 * The base class for cell edit components.  When you view the grid, you see view renderers.  When you select a
 * cell to edit, an extension of this class is dynamically created on top of the cell view.
 */
export class CellEditRenderer {

  column: Column;
  value: any;
  data: Cell = new Cell({key: null, value: null});
  valueValid: boolean = true;
  render: boolean = true;
  format: string = null;
  formatType: string = null;
  activeOnRowHeader: boolean = false;

  // Deprecated
  valueable: boolean = true;

  i: number;
  j: number;

  handleClick: boolean = false;

  keyEvent: Subject<number> = new Subject<number>();

  gridService: GridService;
  gridEventService: GridEventService;
  elementRef: ElementRef;
  renderer: Renderer2;
  changeDetectorRef: ChangeDetectorRef;

  private hostElement: HTMLElement;

  constructor(gridService: GridService, gridEventService: GridEventService, elementRef: ElementRef,
              renderer: Renderer2, changeDetectorRef: ChangeDetectorRef) {
    this.gridService = gridService;
    this.gridEventService = gridEventService;
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.changeDetectorRef = changeDetectorRef;
  }

  setColumn(column: Column) {
    this.column = column;
  }

  setLocation(hostElement: HTMLElement) {
    this.hostElement = hostElement;
    this.updateLocation();
  }

  /**
   * Correctly position the editor popup over the selected cell.
   */
  updateLocation() {
    this.renderer.setStyle(this.elementRef.nativeElement, "position", "absolute");
    this.renderer.setStyle(this.elementRef.nativeElement, "margin-left", this.hostElement.offsetLeft + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "margin-top", this.hostElement.parentElement.offsetTop + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "width", this.hostElement.offsetWidth + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "height", this.hostElement.offsetHeight + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "z-index", "99");
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.updateLocation();
  }

  setData(data: Cell) {
    this.data = data;
    this.value = this.column.formatValue(this.data.value);
  }

  setPosition(i: number, j: number) {
    this.i = i;
    this.j = j;
  }

  /**
   * Update the bound value.
   * TODO: Handle validation;
   *
   * @param {Object} value
   */
  onModelChange(value: Object) {
    this.value = value;
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  setFormat(format: string) {
    if (isDevMode()) {
      console.debug("CellEditRenderer.setFormat: " + format);
    }

    if (!format) {
      return;
    }

    try {
      let a: string[] = format.split(":");
      if (a.length !== 2) {
        return;
      }
      this.formatType = a[0];
      this.format = a[1];
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Allow configuration options to be set.
   *
   * @param {Object} o
   */
  setValues(o: Object) {}

}
