import { Component, EventEmitter, Input, Output } from "@angular/core";

import { EventMeta } from "../utils/event-meta";

@Component({
  selector: "hci-cell-template-abstract",
  template: "<ng-template></ng-template>"
})
export class CellTemplate {

  value: Object = null;
  valueValid: boolean = true;
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
    this.value = value;
    if (this.valueValid) {
      this.valueChange.emit(value);
    }
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.clickEvent.emit(new EventMeta(event.altKey, event.ctrlKey, event.shiftKey));
  }

  onKeyDown(event: KeyboardEvent) {
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

  setValue(value: Object) {
    this.value = value;
  }

  setValues(o: Object) {
    // For sub classes
  }

}
