import {Component, Input} from "@angular/core";

import {GridService} from "../services/grid.service";
import {GridComponent} from "../grid.component";

@Component({
  selector: "hci-grid-config-menu",
  providers: [
    GridService
  ],
  template: `
    <div class="window" (click)="stop($event)" (mouseup)="stop($event)" (mousedown)="stop($event)">
      <ng-container *ngIf="state === 0">
        <div class="panel">
          <div class="cfg-row" (click)="setState(1)">
            <button class="btn btn-primary">General</button>
          </div>
          <div class="cfg-row" (click)="setState(2)">
            <button class="btn btn-primary">Columns</button>
          </div>
        </div>
      </ng-container>
      <ng-container *ngIf="state === 1">
        <div class="header" (click)="setState(0)">
          <span class="">
            <i class="fas fa-chevron-circle-left fa-lg"></i>
          </span>
        </div>
        <div class="panel">
          <div class="cfg-row">
            <div class="label">Theme</div>
            <div class="input"></div>
          </div>
          <div class="cfg-row">
            <div class="label">Column Headers</div>
            <div class="input"></div>
          </div>
          <div class="cfg-row">
            <div class="label">Fixed Columns</div>
            <div class="input"></div>
          </div>
          <div class="cfg-row">
            <div class="label">Page Sizes</div>
            <div class="input"></div>
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
        <div class="header" (click)="setState(0)">
          <span class="">
            <i class="fas fa-chevron-circle-left fa-lg"></i>
          </span>
        </div>
        <div class="panel">
          <div class="cfg-row">
            <div class="label">Visible</div>
            <div class="input">
              
            </div>
          </div>
          <div class="cfg-row">
            <div class="label">Width (px)</div>
            <div class="input"></div>
          </div>
          <div class="cfg-row">
            <div class="label">Width (%)</div>
            <div class="input"></div>
          </div>
          <div class="cfg-row">
            <div class="label">Min Width (px)</div>
            <div class="input"></div>
          </div>
          <div class="cfg-row">
            <div class="label">Max Width (px)</div>
            <div class="input"></div>
          </div>
          <div class="cfg-row">
            <div class="label">PageSizes</div>
            <div class="input"></div>
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
  `]
})
export class ConfigMenuComponent {

  state: number = 0;

  config: any;

  @Input() grid: GridComponent;

  setState(state: number) {
    this.state = state;
    this.config = this.grid.getGridService().getConfig();
  }

  update(key: string, value: any) {
    let config = {};
    config[key] = value;
    this.grid.getGridService().setConfig(config);
    this.config = this.grid.getGridService().getConfig();
    this.grid.doRender();
  }

  stop(event: Event) {
    event.stopPropagation();
  }
}
