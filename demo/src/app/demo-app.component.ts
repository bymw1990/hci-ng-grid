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
      <div style="padding-left: 10px; display: inline-block; width: 100%;">
        <div style="width: 10%; display: inline-block; vertical-align: top;">
            <span style="font-weight: bold;">Examples: </span>
        </div>
        <div style="width: 80%; display: inline-block;">
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/simple">Basic</a>
          </div>
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/alerts">Alerts</a>
          </div>
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/select">Row Select</a>
          </div>
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/copypaste">Copy/Paste</a>
          </div>
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/edit">Inline Edit and Key Nav</a>
          </div>
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/group">Row Grouping</a>
          </div>
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/fixed">Fixed Columns</a>
          </div>
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/filter">Filtering</a>
          </div>
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/dragdrop">Drag n Drop</a>
          </div>
          <div style="width: 24%; display: inline-block; padding-bottom: 5px;">
            <a routerLink="/external">External Sort/Filter/Page</a>
          </div>
        </div>
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
