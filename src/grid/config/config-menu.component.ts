import {ChangeDetectorRef, Component, Input, isDevMode, OnDestroy, OnInit} from "@angular/core";

import {Subscription} from "rxjs/Subscription";

import {GridComponent} from "../grid.component";
import {GridGlobalService} from "../services/grid-global.service";

@Component({
  selector: "hci-grid-config-menu",
  providers: [
    GridGlobalService
  ],
  template: `
    <div class="window" (click)="stop($event)" (mouseup)="stop($event)" (mousedown)="stop($event)">
      <ng-container *ngIf="state === 0">
        <div class="panel">
          <div class="pad" (click)="setState(1)">
            <button class="btn btn-primary">General</button>
          </div>
          <div class="pad" (click)="setState(2)">
            <button class="btn btn-primary">Columns</button>
          </div>
        </div>
      </ng-container>
      <ng-container *ngIf="state === 1">
        <div class="header">
          <span (click)="setState(0)">
            <i class="fas fa-chevron-circle-left fa-lg"></i>
          </span>
        </div>
        <div class="panel">
          <div class="cfg-row">
            <div class="label">Theme</div>
            <div class="input" ngbDropdown #themeDropdown="ngbDropdown">
              <a id="themeDropdown" class="dropdown-toggle" ngbDropdownToggle>
                {{config.theme}}
              </a>
              <ul ngbDropdownMenu aria-labelledby="themeDropdown" class="dropdown-menu pad">
                <ng-container *ngFor="let theme of themeChoices">
                  <li (click)="update('theme', theme); themeDropdown.close();">
                    {{theme}}
                  </li>
                </ng-container>
              </ul>
            </div>
          </div>
          <div class="cfg-row">
            <div class="label">Column Headers</div>
            <div class="input">
              <input type="checkbox" [checked]="config.columnHeaders" (change)="update('columnHeaders', $event.target.checked)">
            </div>
          </div>
          <div class="cfg-row">
            <div class="label">Fixed Columns</div>
            <div class="input">
              <hci-grid-multi-choice [model]="config.fixedColumns"
                                     [value]="'field'"
                                     [display]="'name'"
                                     [choices]="config.columnDefinitions"
                                     (modelChange)="updateArray('fixedColumns', $event)"></hci-grid-multi-choice>
            </div>
          </div>
          <div class="cfg-row">
            <div class="label">Page Sizes</div>
            <div class="input">
              <hci-grid-multi-choice [model]="config.pageSizes" (modelChange)="updateArray('pageSizes', $event)" [sort]="number"></hci-grid-multi-choice>
            </div>
          </div>
          <div class="cfg-row d-flex flex-nowrap">
            <div class="label">Visible Rows</div>
            <div class="input">
              <input type="number" [ngModel]="config.nVisibleRows" (ngModelChange)="update('nVisibleRows', $event)">
            </div>
          </div>
        </div>
      </ng-container>
      <ng-container *ngIf="state === 2">
        <div class="header">
          <span (click)="setState(0)">
            <i class="fas fa-chevron-circle-left fa-lg"></i>
          </span>
          <div class="right" ngbDropdown placement="bottom-right" #columnDropDown="ngbDropdown">
            <a id="groupDropdown" class="dropdown-toggle" ngbDropdownToggle>
              {{selectedColumn.name}}
            </a>
            <ul ngbDropdownMenu aria-labelledby="groupDropdown" class="dropdown-menu pad">
              <ng-container *ngFor="let column of config.columnDefinitions">
                <li (click)="setSelectedColumn(column); columnDropDown.close();"
                    [style.color]="column.visible ? 'green' : 'red'">
                  {{column.name}}
                </li>
              </ng-container>
            </ul>
          </div>
        </div>
        <div class="panel">
          <div class="cfg-row">
            <div class="label">Visible</div>
            <div class="input">
              <input type="checkbox" [checked]="selectedColumn.visible" (change)="updateColumn('visible', $event.target.checked)">
            </div>
          </div>
          <div class="cfg-row">
            <div class="label">Width (px)</div>
            <div class="input">
              <input type="number" [ngModel]="selectedColumn.width" (ngModelChange)="updateColumn('width', $event)">
            </div>
          </div>
          <div class="cfg-row">
            <div class="label">Width (%)</div>
            <div class="input">
              <input type="number" [ngModel]="selectedColumn.widthPercent" (ngModelChange)="updateColumn('widthPercent', $event)">
            </div>
          </div>
          <div class="cfg-row">
            <div class="label">Min Width (px)</div>
            <div class="input">
              <input type="number" [ngModel]="selectedColumn.minWidth" (ngModelChange)="updateColumn('minWidth', $event)">
            </div>
          </div>
          <div class="cfg-row">
            <div class="label">Max Width (px)</div>
            <div class="input">
              <input type="number" [ngModel]="selectedColumn.maxWidth" (ngModelChange)="updateColumn('maxWidth', $event)">
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    
      .window {}
      
      .panel {
        padding: 5px;
      }
      
      .header {
        border-bottom: black 1px solid;
        display: inline-flex;
        width: 100%;
        padding: 5px;
      }
      
      .right {
        margin-left: auto;
        margin-right: 0px;
      }
      
      .cfg-row {
        display: inline-flex;
        padding-left: 0px;
        padding-bottom: 5px;
      }

      .cfg-row .label {
        flex: 0 1 50%;
        min-width: 200px;
      }

      .cfg-row .input {
        flex: 0 1 50%;
        min-width: 200px;
      }
      
      .pad {
        padding: 0.5rem 0.5rem;
      }
  `]
})
export class ConfigMenuComponent implements OnInit, OnDestroy {

  @Input() grid: GridComponent;

  state: number = 0;

  config: any;
  selectedColumn: any;

  configSubscription: Subscription;

  themeChoices: string[];

  constructor(private gridGlobalService: GridGlobalService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.themeChoices = this.gridGlobalService.themeChoices;

    this.grid.getGridService().getConfigSubject().subscribe((config: any) => {
      this.config = config;
    });
  }

  ngOnDestroy() {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }

  setState(state: number) {
    this.state = state;
    this.selectedColumn = this.config.columnDefinitions[0];
  }

  updateArray(key: string, value: any[]) {
    if (isDevMode()) {
      console.debug("ConfigMenuComponent.updateArray: " + key);
      console.debug(value);
    }

    let config = {};
    config[key] = value;
    this.grid.getGridService().updateConfig(config);
    this.grid.doRender();
  }

  update(key: string, value: any) {
    if (isDevMode()) {
      console.debug("ConfigMenuComponent.update: " + key);
      console.debug(value);
    }

    let config = {};
    config[key] = value;
    this.grid.getGridService().updateConfig(config);
    this.grid.doRender();
  }

  setSelectedColumn(column: any) {
    this.selectedColumn = column;
    this.changeDetectorRef.detectChanges();
  }

  updateColumn(key: string, value: any) {
    let i: number = 0;
    for (i = 0; i < this.config.columnDefinitions.length; i++) {
      if (this.config.columnDefinitions[i].field === this.selectedColumn.field) {
        this.config.columnDefinitions[i][key] = value;
      }
    }

    this.grid.getGridService().updateConfig(this.config);
    this.grid.doRender();
  }

  stop(event: Event) {
    event.stopPropagation();
  }
}
