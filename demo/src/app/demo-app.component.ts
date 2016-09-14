import { Component } from "@angular/core";

@Component({
  selector: "app",
  template: `
    <div style="padding: 20px;">
      <h1>hci-ng2-grid-demo</h1>
    </div>
    <div style="padding: 20px;">
      <div (click)="grid = 0">Simple Grid</div>
      <div (click)="grid = 1">Edit Grid</div>
      <div (click)="grid = 2">Group Grid</div>
    </div>
    <simple-grid *ngIf="grid === 0"></simple-grid>
    <edit-grid *ngIf="grid === 1"></edit-grid>
    <group-grid *ngIf="grid === 2"></group-grid>
    `
})
export class DemoAppComponent {
  grid: number = 0;
}
