import { Output, EventEmitter } from "@angular/core";

export const CELL_CSS = `
  .grid-cell-template {
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: transparent;
    padding-left: 8px;
  }
  .grid-cell-template.focused {
    background-color: #ccddff;
  }
  .grid-cell-template.selected {
    background-color: #ffff99;
  }
`;

export class CellTemplate {

  value: Object = null;
  render: boolean = true;
  activeOnRowHeader: boolean = false;
  valueable: boolean = true;
  focused: boolean = false;
  @Output() valueChange: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() keyEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() tabEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() inputFocused: EventEmitter<Object> = new EventEmitter<Object>();

  onModelChange(value: Object) {
    console.log("InputCell.onKeyDown");

    this.value = value;
    this.valueChange.emit(value);
  }

  onKeyDown(event: KeyboardEvent) {
    console.log("CellTemplate.onKeyDown");
    if (event.keyCode === 38 || event.keyCode === 40) {
      this.keyEvent.emit(event.keyCode);
    } else if (event.keyCode === 9) {
      // Tab
      event.preventDefault();
      this.tabEvent.emit(true);
    }
  }

  onFocus() {
    this.focused = true;
  }

  onFocusOut() {
    this.focused = false;
  }

  handleFocus() {
    if (!this.focused) {
      this.inputFocused.emit(true);
    }
  }

}
