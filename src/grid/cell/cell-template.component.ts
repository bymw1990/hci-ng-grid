import { Component, EventEmitter, Input, Output } from "@angular/core";

import { EventMeta } from "../utils/event-meta";

@Component({
  selector: "hci-cell-template-abstract"
})
export class CellTemplate {

  value: Object = null;
  render: boolean = true;
  format: string = null;
  formatType: string = null;
  activeOnRowHeader: boolean = false;
  valueable: boolean = true;

  handleClick: boolean = false;

  @Input() focused: boolean = false;

  @Output() valueChange: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() keyEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() tabEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() inputFocused: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() clickEvent: EventEmitter<Object> = new EventEmitter<Object>();

  onModelChange(value: Object) {
    console.log("InputCell.onKeyDown");

    this.value = value;
    this.valueChange.emit(value);
  }

  onClick(event: MouseEvent) {
    console.log("CellTemplate.onClick");
    event.stopPropagation();
    event.preventDefault();
    this.clickEvent.emit(new EventMeta(event.altKey, event.ctrlKey, event.shiftKey));
  }

  onKeyDown(event: KeyboardEvent) {
    console.log("CellTemplate.onKeyDown");
    if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
      this.keyEvent.emit(event.keyCode);
    } else if (event.keyCode === 9) {
      // Tab
      event.preventDefault();
      this.tabEvent.emit(true);
    }
  }

  onFocus() {
    //console.log("CellTemplate.onFocus");
    this.focused = true;
  }

  onFocusOut() {
    //console.log("CellTemplate.onFocusOut");
    this.focused = false;
  }

  handleFocus(eventMeta: EventMeta) {
    if (!this.focused) {
      this.inputFocused.emit(eventMeta);
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

}
