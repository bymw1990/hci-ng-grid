/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {Component} from "@angular/core";

/**
 * The demo will route to many different types of grids depending on what features are to be shown.
 *
 * Currently there is a simple grid, inline editing, and row grouping.  Each grid will have its own module
 * route and component.  The component will store the demo data, column definitions, and any other configuration
 * specific to that grid.
 */
@Component({
  selector: "demo",
  template: `
    <div class="navbar navbar-dark bg-dark box-shadow">
      <div class="container d-flex justify-content-between">
        <a class="navbar-brand d-flex align-items-center" routerLink="/simple">hci-ng-grid Demo</a>
        <div ngbDropdown placement="bottom-right" class="d-inline-block">
          <button class="btn btn-outline-primary" id="routeList" ngbDropdownToggle>Select A Demo</button>
          <div ngbDropdownMenu aria-labelledby="routeList">
            <a class="dropdown-item" routerLink="/alerts">Alerts</a>
            <a class="dropdown-item" routerLink="/copypaste">Copy/Paste</a>
            <a class="dropdown-item" routerLink="/dynamic-config">Dynamic Config</a>
            <a class="dropdown-item" routerLink="/empty">Empty Grid</a>
            <a class="dropdown-item" routerLink="/external">External Sort/Filter/Page</a>
            <a class="dropdown-item" routerLink="/edit">Inline Edit and Key Nav</a>
            <a class="dropdown-item" routerLink="/filter">Filtering</a>
            <a class="dropdown-item" routerLink="/fixed">Fixed Columns</a>
            <a class="dropdown-item" routerLink="/paging">Paging</a>
            <a class="dropdown-item" routerLink="/row-group">Row Grouping</a>
            <a class="dropdown-item" routerLink="/row-select">Row Select</a>
            <a class="dropdown-item" routerLink="/simple">Simple</a>
            <a class="dropdown-item" routerLink="/theming">Themes</a>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid" style="padding-bottom: 50px;">
      <router-outlet></router-outlet>
    </div>
    `,
  styles: [ `
    a {
      color: black;
    }
  ` ]
})
export class DemoComponent {}
