import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from "@angular/core";

import { NgbDropdown } from "@ng-bootstrap/ng-bootstrap";

import { CellTemplate } from "./cell-template.component";

/**
 * The ng2-bootstrap datepicker does not yet offer a popup mode, so we will wrap the datepicker in a traditional
 * bootstrap dropdown.
 */
@Component({
    selector: "hci-grid-cell-datepicker",
    template: `
    <div #dropdown="ngbDropdown" (keydown)="onDateKeyDown($event);" class="hci-grid-cell-template" ngbDropdown (openChange)="onToggle();" [class.focused]="focused">
      <div #datepickerbutton id="single-button" class="hci-cell-datebutton" ngbDropdownToggle (click)="onClick($event)">
        {{ value | date:dateFormat }}
      </div>
      <div #datepickerParent role="menu" role="menu" aria-labelledby="single-button" class="key-scope dropdown-menu negate-dropdown-menu" (click)="dateClick($event)">
        <ngb-datepicker #datepickerChild [startDate]="ngbValue" [ngModel]="ngbValue" (ngModelChange)="onModelChange($event);" class="hci-cell-datepicker"></ngb-datepicker>
      </div>
    </div>
  `,
    styles: [ `
    .hci-cell-datebutton {
      width: 100%;
      height: 100%;
      background-color: transparent;
      border: none;
      text-align: left;
    }
    .hci-cell-datebutton:after {
      display: none;
    }
    .hci-cell-datepicker {
      background-color: white;
      position: fixed;
    }
    .negate-dropdown-menu.dropdown-menu {
      position: fixed;
      top: auto;
      left: auto;
      padding: 0px;
      margin: 0px;
      border: none;
    }
  ` ],
    encapsulation: ViewEncapsulation.None,
})
export class DatePickerCell extends CellTemplate {

    @Input() dateFormat: string = "mediumDate";

    @ViewChild("dropdown") dropdown: NgbDropdown;
    @ViewChild("datepickerbutton") datepickerbutton: ElementRef;
    @ViewChild("datepickerParent") datepickerParent: ElementRef;
    @ViewChild("datepickerChild") datepickerChild: ElementRef;

    handleClick: boolean = true;
    public disabled: boolean = false;
    public status: { isopen: boolean } = { isopen: false };

    ngbValue: Object = null;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super();

        this.setValue((new Date()).getTime());
    }

    onToggle() {
        if (this.dropdown.isOpen()) {
            if (this.datepickerParent.nativeElement.getElementsByClassName("bg-primary").length === 1) {
                this.datepickerParent.nativeElement.getElementsByClassName("bg-primary")[0].focus();
            } else {
                this.datepickerParent.nativeElement.getElementsByClassName("hci-cell-datepicker")[0].focus();
            }
        } else {
            this.onFocusOut();
        }
    }

    dateClick(event: MouseEvent) {
        var el = event.target as HTMLElement;
        if (!el.classList.contains("btn-secondary")) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * This overrides the default cell template.  When the datetime in milliseconds is passed to the bootstrap datepicker,
     * it is converted to a js date.  When the date is updated, the js date is saved.  However, we want a long in milliseconds.
     * So we override the listener for the datepicker model to convert the value back to milliseconds before emitting the
     * new value back to the parent grid.
     *
     * @param value
     */
    onModelChange(value: Object) {
        this.ngbValue = value;

        var ms: number = (new Date(value["year"], value["month"] - 1, value["day"], 0, 0, 0)).getTime();
        this.value = ms;
        this.valueChange.emit(ms);
    }

    onFocus() {
        super.onFocus();
        this.datepickerbutton.nativeElement.focus();
        this.dropdown.open();
    }

    onFocusOut() {
        this.focused = false;
        this.datepickerbutton.nativeElement.blur();
        this.dropdown.close();
    }

    focus() {
        if (this.dropdown.isOpen()) {
            this.dropdown.close();
        } else {
            this.dropdown.open();
        }
    }

    onDateKeyDown(event: KeyboardEvent) {
        var el: HTMLElement = event.target as HTMLElement;
        var inKeyScope: boolean = false;

        while (el !== null) {
            if (el.getElementsByClassName("key-scope") !== null) {
                inKeyScope = true;
                break;
            } else {
                el = el.parentElement;
            }
        }

        if (inKeyScope) {
            event.stopPropagation();
        } else {
            if (event.keyCode === 9 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
                this.datepickerbutton.nativeElement.blur();
                this.dropdown.close();
                this.onKeyDown(event);
            }
        }
    }

    setValue(value: Object) {
        let date: Date = new Date(value);
        this.ngbValue = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
        this.value = date.getTime();
    }

    setValues(o: Object) {
        if (o["dateFormat"]) {
            this.dateFormat = o["dateFormat"];
        }
        this.changeDetectorRef.markForCheck();
    }
}
