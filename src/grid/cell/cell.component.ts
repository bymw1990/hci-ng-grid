import { Component, Input, ViewContainerRef, ComponentFactoryResolver, ViewChild, Output, EventEmitter } from "@angular/core";

import { Cell } from "../cell/cell";
import { Point } from "../utils/point";
import { GridConfigService } from "../services/grid-config.service";
import { GridEventService } from "../services/grid-event.service";
import { GridDataService } from "../services/grid-data.service";
import { CellTemplate } from "./cell-template.component";
import { LabelCell } from "./label-cell.component";

/**
 * A Cell represents an i and j position in a grid.  This component binds the grid data for that position.  Rendering of
 * the data is left to a dynamically generated template which extends the CellTemplate class.  By default the DefaultCell
 * class is used which simply renders the value in a span.
 */
@Component({
  selector: "hci-cell",
  template: `
    <span><span #template style="display: none;"></span></span>
  `
})
export class CellComponent {

  @Input() type: any;
  @Input() i: number;
  @Input() j: number;
  @Input() k: number;

  @Output() valueChange: EventEmitter<Object> = new EventEmitter<Object>();

  @Output() cellFocused: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() onUDLR: EventEmitter<Object> = new EventEmitter<Object>();

  nColumns: number;
  private isViewInitialized: boolean = false;

  @ViewChild("template", { read: ViewContainerRef })
  private template: any;

  private data: Cell;
  private componentRef: CellTemplate = null;
  constructor(private resolver: ComponentFactoryResolver, private gridEventService: GridEventService, private gridConfigService: GridConfigService, private gridDataService: GridDataService) {}

  ngAfterContentInit() {
    //console.log("CellComponent.ngAfterContentInit " + this.i + " " + this.j + " " + this.k);
    ////console.log(this.value);
    this.nColumns = this.gridConfigService.gridConfiguration.columnDefinitions.length;
    this.type = this.gridConfigService.gridConfiguration.columnDefinitions[this.k].template;
    this.isViewInitialized = true;
    this.createComponent();

    this.gridEventService.addSelectedLocationObserver((location) => {
      //console.log("CellComponent.ngAfterInit gridEventService.addSelectedLocationObserver " + location.toString());
      if (location.equalsIJK(this.i, this.j, this.k)) {
        this.onFocus();
      } else {
        this.onFocusOut();
      }
    });
    //console.log("CellComponent.ngAfterContentInit Done");
  }

  /**
   * Every Cell contains an input that is positioned off the screen when the input is selected via a tab, we call the
   * CellTemplate's focus() to determine what to do.  By default this method is empty.  In the case of an input cell,
   * the input is focused.  In the case of a date, the datepicker popup is opened.
   */
  onFocus() {
    //console.log("Cell.onFocus " + this.i + " " + this.j);
    //this.componentRef.element.nativeElement.focus();
    //this.cellFocused.emit({ "i": this.i, "j": this.j });
    this.componentRef.onFocus();
  }

  onFocusOut() {
    this.componentRef.onFocusOut();
  }

  handleInputFocus() {
    //console.log("handleInputFocus");
  }

  /**
   * The Cell stores a value double binded from the grid[i][j] data.  When we dynamically create a cell template, the
   * parent data is not passed down to the component reference.  Similarly, events emitted from the child are not
   * detectable here automatically.  What we do is pass our value to the component and subscribe to the component's
   * valueChange emitter.
   * This work is handled by the CellTemplate parent class, so any template class just has to include the following code
   * somewhere to make it work: [ngModel]="value" (ngModelChange)="onModelChange($event);"
   * Whatever the template is, such as an input, as it changes will adjust the model which will trigger a valueChange
   * event making this parent class aware that the model changed.
   */
  createComponent() {
    //console.log("CellComponent.createComponent");
    //console.log(this.type);
    if(!this.isViewInitialized) {
      return;
    }
    if (this.componentRef !== null) {
      return;
    }

    let setIsGroup: boolean = false;
    if (this.gridConfigService.gridConfiguration.columnDefinitions[this.k].isGroup && this.j !== -1) {
      this.type = LabelCell;
      setIsGroup = true;
    }

    let factory = this.resolver.resolveComponentFactory(this.type);
    this.componentRef = this.template.createComponent(factory).instance;
    if (this.j === -1 && this.componentRef.activeOnRowHeader) {
      this.componentRef.render = true;
    }

    if (setIsGroup) {
      this.componentRef.valueable = false;
    }

    if (this.componentRef.valueable) {
      //this.componentRef.value = this.value;
      this.data = this.gridDataService.getCell(this.i, this.j, this.k);
      this.componentRef.value = this.data.value;
      //console.log("CellComponent set componentRef value: " + this.componentRef.value);

      this.componentRef.valueChange.subscribe((value: Object) => {
        //console.log("valueChange");
        //console.log(value);
        //this.valueChange.emit(value);
        this.data.value = value;
        this.gridDataService.handleValueChange(this.i, this.j, this.data.key, this.k, value);
      });
    }
    this.componentRef.keyEvent.subscribe((keyCode: number) => {
      //console.log("CellComponent subscribe keyEvent");
      this.onKeyDown(keyCode);
    });
    this.componentRef.tabEvent.subscribe((value: boolean) => {
      //console.log("CellComponent subscribe tabEvent");
      this.gridEventService.tabFrom(new Point(this.i, this.j, this.k));
    });
    this.componentRef.inputFocused.subscribe((value: boolean) => {
      //console.log("CellComponent subscribe inputFocused");
      this.gridEventService.setSelectedLocation(new Point(this.i, this.j, this.k));
    });
  }

  onKeyDown(keyCode: number) {
    //console.log("CellComponent.onKeyDown");
    //console.log(event);
    if (keyCode === 37) {
      this.gridEventService.arrowFrom(new Point(this.i, this.j, this.k), -1, 0);
    } else if (keyCode === 39) {
      this.gridEventService.arrowFrom(new Point(this.i, this.j, this.k), 1, 0);
    } else if (keyCode === 38) {
      this.gridEventService.arrowFrom(new Point(this.i, this.j, this.k), 0, -1);
    } else if (keyCode === 40) {
      this.gridEventService.arrowFrom(new Point(this.i, this.j, this.k), 0, 1);
    }
  }

}
