/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { Component } from "@angular/core";

/**
 * The demo will route to many different types of grids depending on what features are to be shown.
 *
 * Currently there is a simple grid, inline editing, and row grouping.  Each grid will have its own module
 * route and component.  The component will store the demo data, column definitions, and any other configuration
 * specific to that grid.
 */
@Component({
  selector: "app",
  template: `
    <div style="padding: 20px;">
      <h1>hci-ng2-grid-demo</h1>
    </div>
    <div style="padding-left: 20px;">
      <span>Examples: </span>
      <a routerLink="/simple" style="padding: 20px;">Simple</a>
      <a routerLink="/edit" style="padding: 20px;">Inline Edit</a>
      <a routerLink="/group" style="padding: 20px;">Grouping</a>
      <a routerLink="/fixed" style="padding: 20px;">Fixed Columns</a>
      <a routerLink="/filter" style="padding: 20px;">Filtering</a>
      <a routerLink="/dragdrop" style="padding: 20px;">Drag n Drop</a>
      <a routerLink="/external" style="padding: 20px;">External Sort/Filter/Page</a>
    </div>
    <router-outlet></router-outlet>
    `
})
export class DemoAppComponent {}
