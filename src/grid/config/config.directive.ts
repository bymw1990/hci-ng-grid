import {Directive, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";

import {GridConfigService} from "../services/grid-config.service";
import {Column} from "../column/column";

@Directive({
  selector: "[hci-grid-config]"
})
export class HciGridConfigDirective implements OnInit, OnChanges {

  @Input("hci-grid-config") config: any = {};

  @Input() rowSelect: boolean;
  @Input() cellSelect: boolean;
  @Input() keyNavigation: boolean;
  @Input() nUtilityColumns: number;
  @Input() columnDefinitions: Column[];
  @Input() fixedColumns: string[];
  @Input() groupBy: string[];
  @Input() externalFiltering: boolean;
  @Input() externalSorting: boolean;
  @Input() externalPaging: boolean;
  @Input() pageSize: number;
  @Input() pageSizes: number[];

  constructor(private gridConfigService: GridConfigService) {}

  ngOnInit() {
    this.buildConfig();
    this.gridConfigService.setConfig(this.config);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.info("ngOnChanges");

    for (let name in changes) {
      console.info(name);
      /*
      let change = changes[name]l
      let curr = change.currentValue;
      let prev = change.previousValue;
       */
    }
  }

  buildConfig() {
    if (this.rowSelect !== undefined) {
      this.config.rowSelect = this.rowSelect;
    }
    if (this.cellSelect !== undefined) {
      this.config.cellSelect = this.cellSelect;
    }
    if (this.keyNavigation !== undefined) {
      this.config.keyNavigation = this.keyNavigation;
    }
    if (this.nUtilityColumns !== undefined) {
      this.config.nUtilityColumns = this.nUtilityColumns;
    }
    if (this.columnDefinitions !== undefined) {
      this.config.columnDefinitions = this.columnDefinitions;
    }
    if (this.fixedColumns !== undefined) {
      this.config.fixedColumns = this.fixedColumns;
    }
    if (this.groupBy !== undefined) {
      this.config.groupBy = this.groupBy;
    }
    if (this.externalFiltering !== undefined) {
      this.config.externalFiltering = this.externalFiltering;
    }
    if (this.externalSorting !== undefined) {
      this.config.externalSorting = this.externalSorting;
    }
    if (this.externalPaging !== undefined) {
      this.config.externalPaging = this.externalPaging;
    }
    if (this.pageSize !== undefined) {
      this.config.pageSize = this.pageSize;
    }
    if (this.pageSizes !== undefined) {
      this.config.pageSizes = this.pageSizes;
    }
  }
}
