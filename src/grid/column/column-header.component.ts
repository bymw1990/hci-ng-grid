import {Component, ComponentFactoryResolver, ElementRef, HostListener, Input, Renderer2, ViewContainerRef} from "@angular/core";

import {Column} from "./column";
import {GridService} from "../services/grid.service";
import {SortInfo} from "../utils/sort-info";
import {FilterRenderer} from "./filterRenderers/filter-renderer";
import {FilterInfo} from "../utils/filter-info";

/**
 * Renders the column title and controls icons for filtering and sorting.
 */
@Component({
  selector: "hci-column-header",
  template: `
    <div class="d-flex flex-nowrap"
         style="width: inherit; align-items: center; padding-left: 8px; margin-top: auto; margin-bottom: auto;">
      <span (click)="doSort()"
            class="hci-grid-tooltip">
        {{ column.name }}
        <span class="hci-grid-tooltip-text">
          {{ column.name }}
        </span>
      </span>
      <div class="d-flex flex-nowrap sort-icon">
        <div [id]="'filter-' + column.id" *ngIf="column.filterRenderer" ngbDropdown [placement]="column.isLast ? 'bottom-right' : 'bottom-left'">
          <a id="filterDropdownToggle"
             (click)="showFilter()"
             class="dropdown-toggle"
             [style.color]="hasFilters > 0 ? '#00aa00' : 'inherit'">
            <i class="fas fa-filter"></i>
          </a>
        </div>
        <div [id]="'sort-' + column.id" *ngIf="column.sortable" style="margin-left: 5px;">
          <span *ngIf="asc === 1"><span class="fas fa-arrow-alt-circle-up"></span></span>
          <span *ngIf="asc === -1"><span class="fas fa-arrow-alt-circle-down"></span></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sort-icon {
      margin-left: auto;
      padding-right: 5px;
    }

    .dropdown-toggle::after {
      display: none;
    }
    
    .dropdown-menu {
      padding: 0;
    }
    
    .hci-grid-tooltip {
      text-overflow: ellipsis;
      overflow-x: hidden;
    }

    .hci-grid-tooltip .hci-grid-tooltip-text {
      display: none;
      position: absolute;
      background-color: black;
      color: #fff;
      padding: 2px 4px;
      border-radius: 6px;
      top: -4px;
      left: 105%;
      z-index: 100;
    }

    .hci-grid-tooltip:hover .hci-grid-tooltip-text {
      display: inherit;
    }
  `],
})
export class ColumnHeaderComponent {

  @Input() column: Column;
  @Input("container") headerContainer: ViewContainerRef;

  asc: number = 0;
  hasFilters: boolean = false;

  private filterComponent: FilterRenderer;

  constructor(private gridService: GridService, private resolver: ComponentFactoryResolver, private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.gridService.getFilterMapSubject().subscribe((filterMap: Map<string, FilterInfo[]>) => {
      if (this.column) {
        if (filterMap.has(this.column.field)) {
          this.hasFilters = filterMap.get(this.column.field).filter((filterInfo: FilterInfo) => {
            return filterInfo.valid;
          }).length === 0 ? false : true;
        }
      }
    });

    this.gridService.sortInfoObserved.subscribe((sortInfo: SortInfo) => {
      if (this.column.field === sortInfo.field) {
        if (sortInfo.asc) {
          this.asc = 1;
        } else {
          this.asc = -1;
        }
      } else {
        this.asc = 0;
      }
    });
  }

  ngAfterViewInit() {
    if (this.column.filterRenderer) {
      let factory = this.resolver.resolveComponentFactory(this.column.filterRenderer);
      this.filterComponent = this.headerContainer.createComponent(factory).instance;
      this.filterComponent.column = this.column;
      this.filterComponent.setConfig(this.column.filterConfig);
      this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "display", "none");
      this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "position", "absolute");
      this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "z-index", "50");
      this.filterComponent.close.subscribe((closed: boolean) => {
        this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "display", "none");
      });
    }
  }

  showFilter() {
    this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "display", "inherit");
    let wHost: number = this.filterComponent.width;
    let mainContent: number = (<HTMLElement>this.el.nativeElement.closest("#mainContent")).offsetWidth;
    let xView: number = (<HTMLElement>this.el.nativeElement.closest(".header-view")).offsetLeft;
    let x: number = xView + this.el.nativeElement.offsetLeft + this.el.nativeElement.offsetWidth - 30;
    if (x + wHost > mainContent) {
      x = mainContent - wHost;
    }
    this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "margin-top", "30px");
    this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "margin-left", x + "px");
  }

  doSort() {
    this.gridService.sort(this.column.field);
  }

  @HostListener("document:click", ["$event"])
  private clickout(event) {
    if (!this.el.nativeElement.contains(event.target) && this.filterComponent) {
      this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "display", "none");
    }
  }
}
