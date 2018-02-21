import {ElementRef, HostListener, Renderer2} from "@angular/core";

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
  valueable: boolean = true;
  i: number;
  j: number;

  handleClick: boolean = false;

  focused: boolean = false;

  keyEvent: Subject<number> = new Subject<number>();

  gridService: GridService;
  gridEventService: GridEventService;
  elementRef: ElementRef;
  renderer: Renderer2;

  private hostElement: HTMLElement;

  constructor(gridService: GridService, gridEventService: GridEventService, elementRef: ElementRef, renderer: Renderer2) {
    this.gridService = gridService;
    this.gridEventService = gridEventService;
    this.elementRef = elementRef;
    this.renderer = renderer;
  }

  setColumn(column: Column) {
    this.column = column;
  }

  setLocation(hostElement: HTMLElement) {
    this.hostElement = hostElement;
    this.updateLocation();
  }

  updateLocation() {
    console.debug("updateLocation: " + this.hostElement.offsetLeft + " " + this.hostElement.parentElement.scrollLeft + " " + this.hostElement.offsetTop + " " + this.hostElement.parentElement.scrollTop);
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
    this.value = this.gridService.formatData(this.j, this.data.value);
  }

  setPosition(i: number, j: number) {
    this.i = i;
    this.j = j;
  }

  onModelChange(value: Object) {
    this.value = value;
    /*console.debug("onModelChange: " + value);
    this.data.value = value;
    if (this.valueValid) {
      //this.valueChange.emit(value);
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.k, this.data.value);
    }*/
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
      this.keyEvent.next(event.keyCode);
    } else if (event.keyCode === 9) {
      // Tab
      event.preventDefault();
      //this.tabEvent.emit(true);
    }
  }

  setFormat(format: string) {
    if (format === null) {
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

  setValues(o: Object) {
    // For sub classes
  }

}
