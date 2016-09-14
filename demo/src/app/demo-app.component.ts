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
    <div>
      <a routerLink="/simple" style="padding: 20px;">Simple Grid</a>
      <a routerLink="/edit" style="padding: 20px;">Edit Grid</a>
      <a routerLink="/group" style="padding: 20px;">Group Grid</a>
    </div>
    <router-outlet></router-outlet>
    `
})
export class DemoAppComponent {}
