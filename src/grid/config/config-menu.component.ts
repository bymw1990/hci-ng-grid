import {ChangeDetectorRef, Component, Input, isDevMode, OnDestroy, OnInit} from "@angular/core";

import {Subscription} from "rxjs/Subscription";

import {GridComponent} from "../grid.component";
import {GridGlobalService} from "../services/grid-global.service";
import {Dictionary} from "../model/dictionary.interface";

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
                {{getDisplay(themeChoices, config.theme)}}
              </a>
              <ul ngbDropdownMenu aria-labelledby="themeDropdown" class="dropdown-menu pad">
                <ng-container *ngFor="let theme of themeChoices">
                  <li (click)="update('theme', theme.value); themeDropdown.close();">
                    {{theme.display}}
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
        </div>
        <div class="sub-header">
          <div *ngFor="let column of config.columnDefinitions; let i = index"
               class="column"
               [class.selected]="column.name === selectedColumn.name"
               [style.backgroundColor]="column.visible ? 'lightgreen' : 'lightcoral'"
               (click)="setSelectedColumn(column)">
            {{column.name}}
          </div>
        </div>
        <div class="panel">
          <div class="cfg-row">
            <div class="label">Position</div>
            <div class="input">
              <span (click)="updateSortOrder(selectedColumn.field, -2)" class="pad-right"><i class="fas fa-fast-backward"></i></span>
              <span (click)="updateSortOrder(selectedColumn.field, -1)" class="pad-right"><i class="fas fa-play" data-fa-transform="rotate-180"></i></span>
              <span (click)="updateSortOrder(selectedColumn.field, 1)" class="pad-right"><i class="fas fa-play"></i></span>
              <span (click)="updateSortOrder(selectedColumn.field, 2)" class="pad-right"><i class="fas fa-fast-forward"></i></span>
            </div>
          </div>
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
    
      .window {
        min-width: 33vw;
        max-width: 33vw;
        background-color: white;
        border: black 1px solid;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
      }
      
      .panel {
        margin-top: 5px;
        margin-bottom: 5px;
      }
      
      .header {
        border-bottom: black 1px solid;
        display: inline-flex;
        width: 100%;
        padding: 5px;
      }

      .sub-header {
        border-bottom: black 1px solid;
        display: inline-flex;
        width: 100%;
        padding: 5px;
      }

      .sub-header .column {
        margin-right: 10px;
        background-color: lightblue;
        border: gray 1px solid;
        padding: 3px 6px;
        border-radius: 10px;
        white-space: nowrap;
      }

      .sub-header .column.selected {
        border: red 2px solid;
      }

      .right {
        margin-left: auto;
        margin-right: 0px;
      }
      
      .pad-right {
        margin-right: 10px;
      }
      
      .cfg-row {
        display: flex;
        padding: 5px;
        align-items: center;
      }

      .cfg-row .label {
        flex: 1 1 50%;
      }

      .cfg-row .input {
        flex: 1 1 50%;
      }

      .cfg-row:nth-child(even) {
        background: #f0f0f0;
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

  themeChoices: Dictionary[];

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

  getDisplay(choices: Dictionary[], value: string) {
    for (let choice of choices) {
      if (choice.value === value) {
        return choice.display;
      }
    }
    return "N/A";
  }

  setState(state: number) {
    this.state = state;
    this.selectedColumn = this.config.columnDefinitions[0];
  }

  updateSortOrder(field: string, position: number) {
    this.grid.getGridService().updateSortOrder(field, position);
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
    //this.grid.doRender();
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

    this.grid.getGridService().updateConfig(this.config, true);
    //this.grid.doRender();
  }

  stop(event: Event) {
    event.stopPropagation();
  }
}
