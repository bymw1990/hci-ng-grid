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
    <div style="background-color: #ddddff; border-bottom: black 1px solid;">
      <div style="padding: 10px;">
        <h1>hci-ng2-grid-demo</h1>
      </div>
      <div style="padding-left: 10px;">
        <span style="font-weight: bold;">Examples: </span>
        <a routerLink="/simple" style="padding: 20px;">Basic</a>
        <a routerLink="/alerts" style="padding: 20px;">Alerts</a>
        <a routerLink="/select" style="padding: 20px;">Row Select</a>
        <a routerLink="/copypaste" style="padding: 20px;">Copy/Paste</a>
        <a routerLink="/edit" style="padding: 20px;">Inline Edit and Key Nav</a>
        <a routerLink="/group" style="padding: 20px;">Row Grouping</a>
        <a routerLink="/fixed" style="padding: 20px;">Fixed Columns</a>
        <a routerLink="/filter" style="padding: 20px;">Filtering</a>
        <a routerLink="/dragdrop" style="padding: 20px;">Drag n Drop</a>
        <a routerLink="/external" style="padding: 20px;">External Sort/Filter/Page</a>
      </div>
    </div>
    <router-outlet></router-outlet>
    `,
  styles: [ `
    a {
      color: black;
    }
  ` ]
})
export class DemoAppComponent {}
