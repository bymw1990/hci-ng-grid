import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from "@angular/core";

import { EventMeta } from "../utils/event-meta";
import {GridService} from "../services/grid.service";
import {Cell} from "./cell";
import {Subject} from "rxjs/Subject";
import {GridEventService} from "../services/grid-event.service";

export class CellTemplate {

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
  k: number;

  handleClick: boolean = false;

  //@Input() focused: boolean = false;
  focused: boolean = false;

  /*@Output() valueChange: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() keyEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() tabEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() inputFocused: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() clickEvent: EventEmitter<Object> = new EventEmitter<Object>();*/

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

  setLocation(hostElement: HTMLElement) {
    this.hostElement = hostElement;
    this.updateLocation();
  }

  updateLocation() {
    this.renderer.setStyle(this.elementRef.nativeElement, "position", "absolute");
    this.renderer.setStyle(this.elementRef.nativeElement, "left", this.hostElement.offsetLeft + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "top", this.hostElement.offsetTop + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "width", this.hostElement.offsetWidth + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "height", this.hostElement.offsetHeight + "px");
    this.renderer.setStyle(this.elementRef.nativeElement, "border", "red 1px solid");
    this.renderer.setStyle(this.elementRef.nativeElement, "background-color", "white");
    this.renderer.setStyle(this.elementRef.nativeElement, "z-index", "10");
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.updateLocation();
  }

  setData(data: Cell) {
    this.data = data;
    this.value = this.gridService.formatData(this.k, this.data.value);
  }

  setPosition(i: number, j: number, k: number) {
    this.i = i;
    this.j = j;
    this.k = k;
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
    //this.clickEvent.emit(new EventMeta(event.altKey, event.ctrlKey, event.shiftKey));
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

  onFocus() {
    //console.log("CellTemplate.onFocus");
    //this.focused = true;
  }

  onFocusOut() {
    //console.log("CellTemplate.onFocusOut");
    //this.focused = false;
  }

  handleFocus(eventMeta: EventMeta) {
    /*if (!this.focused) {
      this.inputFocused.emit(eventMeta);
    }*/
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
