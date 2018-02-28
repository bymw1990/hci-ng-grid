import {
  Component, ComponentFactoryResolver, ElementRef, HostListener, Input, Renderer2, Type, ViewChild,
  ViewContainerRef
} from "@angular/core";

import {Column} from "./column";
import {GridService} from "../services/grid.service";
import {SortInfo} from "../utils/sort-info";
import {FilterRenderer} from "./filterRenderers/filter-renderer";
import {Observable} from "rxjs/Observable";

/**
 * fa-sort fa-sort-asc fa-sort-desc
 */
@Component({
  selector: "hci-column-header",
  template: `
    <div class="d-flex flex-nowrap" style="width: inherit; align-items: center; padding-left: 8px; margin-top: auto; margin-bottom: auto;">
      <span (click)="doSort()">{{ column.name }}</span>
      <div class="d-flex flex-nowrap sort-icon">
        <div [id]="'filter-' + column.id" *ngIf="column.filterRenderer" ngbDropdown [placement]="column.isLast ? 'bottom-right' : 'bottom-left'">
          <a id="filterDropdownToggle"
             (click)="showFilter()"
             class="dropdown-toggle"
             [style.color]="column.filters.length > 0 ? '#00aa00' : 'inherit'">
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
  `],
})
export class ColumnHeaderComponent {

  @Input() column: Column;
  @Input("container") popupContainer: ViewContainerRef;

  asc: number = 0;

  private filterComponent: FilterRenderer;

  constructor(private gridService: GridService, private resolver: ComponentFactoryResolver, private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
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
      console.debug(this.popupContainer);
      let factory = this.resolver.resolveComponentFactory(this.column.filterRenderer);
      this.filterComponent = this.popupContainer.createComponent(factory).instance;
      this.filterComponent.column = this.column;
      this.filterComponent.setConfig(this.column.filterConfig);
      this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "display", "none");
      this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "position", "absolute");
      this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "z-index", "50");
    }
  }

  showFilter() {
    let x: number = this.el.nativeElement.offsetLeft + this.el.nativeElement.offsetWidth - 60;
    this.renderer.setStyle(this.filterComponent.elementRef.nativeElement, "display", "inherit");
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
