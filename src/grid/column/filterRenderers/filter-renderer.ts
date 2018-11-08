import {ElementRef, EventEmitter, Input, Output} from "@angular/core";

import {Column} from "../column";
import {GridService} from "../../services/grid.service";
import {FilterInfo} from "../../utils/filter-info";

export class FilterRenderer {

  @Input() column: Column;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  filters: FilterInfo[];
  config: any = {};
  shared = false;
  width: number = 250;
  gridService: GridService;
  elementRef: ElementRef;

  constructor(gridService: GridService, elementRef: ElementRef) {
    this.gridService = gridService;
    this.elementRef = elementRef;
  }

  ngOnInit() {
    this.filtersSubscribe();
  }

  filtersSubscribe() {
    this.gridService.getFilterMapSubject().subscribe((filterMap: Map<string, FilterInfo[]>) => {
      if (this.column) {
        if (filterMap.has(this.column.field)) {
          this.filters = filterMap.get(this.column.field);
        } else {
          this.reset();
          this.gridService.addFilters(this.column.field, this.filters);
        }
      }
    });
  }

  filter() {
    // To Override
  }

  getConfig(): any {
    return this.config;
  }

  setConfig(config: any) {
    if (config) {
      this.config = config;
    }
  }

  reset() {
    if (!this.filters) {
      this.filters = [];
    }
  }

  stop(event: MouseEvent) {
    event.stopPropagation();
  }

  toggleShared() {
    this.shared = !this.shared;
    this.filter();
  }

  valueClear() {
    this.close.emit(true);
  }
}
