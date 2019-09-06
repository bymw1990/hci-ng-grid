import {Component, EventEmitter, Input, isDevMode, Output} from "@angular/core";

@Component({
  selector: "hci-grid-multi-choice",
  template: `
    <div style="display: inline-flex; flex-wrap: wrap; align-items: center;"
         (keydown)="$event.stopPropagation()"
         (keypress)="$event.stopPropagation()"
         (keyup)="$event.stopPropagation()">
      <div *ngFor="let o of model" class="bubble">
        <span *ngIf="!display">{{o}}</span>
        <span *ngIf="display">{{getDisplay(o)}}</span>
        <span (click)="remove($event, o)" style="margin-left: 5px;">
          <i class="fas fa-times"></i>
        </span>
      </div>
      <div *ngIf="!choices">
        <ng-container *ngIf="!adding">
          <span (click)="$event.stopPropagation(); adding = true;"
                style="color: green;">
            <i class="fas fa-plus fa-lg"></i>
          </span>
        </ng-container>
        <ng-container *ngIf="adding">
          <input type="text"
                 style="width: 100px;"
                 [ngModel]="newValue"
                 (keyup)="addInput($event)" />
        </ng-container>
      </div>
      <div *ngIf="choices">
        <div class="input">
          <a [matMenuTriggerFor]="cfgMultiDropdown">
            <span (click)="$event.stopPropagation(); cfgMultiDropdown.open();">
              <i class="fas fa-plus fa-lg"></i>
            </span>
          </a>
          <mat-menu #cfgMultiDropdown="matMenu" class="pad">
            <ng-container *ngFor="let choice of choices">
              <li (click)="addChoice(choice); cfgMultiDropdown.close();">
                {{choice[display]}}
              </li>
            </ng-container>
          </mat-menu>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .bubble {
        display: flex;
        padding: 5px 10px;
        background-color: lightblue;
        border-radius: 15px;
        margin-right: 10px;
        margin-bottom: 2px;
      }
    `
  ]
})
export class ConfigMultiChoiceComponent {

  @Input() model: any[] = [];
  @Input() value: string;
  @Input() display: string;
  @Input() sort: string;

  @Input() choices: any[];

  @Output() modelChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  newValue: any;
  adding: boolean = false;

  ngOnInit() {
    if (this.value && !this.display) {
      this.display = this.value;
    }

    if (isDevMode()) {
      console.debug("ConfigMultiChoiceComponent.ngOnInit: value: " + this.value + ", display: " + this.display);
    }
  }

  getDisplay(value: any) {
    for (let choice of this.choices) {
      if (value === choice[this.value]) {
        return choice[this.display];
      }
    }
    return "N/A";
  }

  addInput(event: KeyboardEvent) {
    if (isDevMode()) {
      console.debug("addInput");
    }
    if (!this.model) {
      this.model = [];
    }
    this.newValue = (<HTMLInputElement>event.target).value;

    if (event.keyCode === 13) {
      this.model.push(this.newValue);
      this.sortModel();
      this.modelChange.emit(this.model);
      this.adding = false;
    } else if (event.keyCode === 27) {
      this.newValue = "";
      this.adding = false;
    }
  }

  addChoice(o: any) {
    if (!this.model) {
      this.model = [];
    }
    this.model.push(o[this.value]);
    this.sortModel();
    this.modelChange.emit(this.model);
    this.adding = false;
  }

  sortModel() {
    if (!this.sort) {
      return;
    } else if (this.sort === "string") {
      if (this.value) {
        this.model.sort((a: any, b: any) => {
          if (a[this.value] < b[this.value]) {
            return -1;
          } else if (a[this.value] > b[this.value]) {
            return 1;
          } else {
            return 0;
          }
        });
      } else {
        this.model.sort((a: any, b: any) => {
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    } else if (this.sort === "number") {
      if (this.value) {
        this.model.sort((a: any, b: any) => {
          if (+a[this.value] < +b[this.value]) {
            return -1;
          } else if (+a[this.value] > +b[this.value]) {
            return 1;
          } else {
            return 0;
          }
        });
      } else {
        this.model.sort((a: any, b: any) => {
          if (+a < +b) {
            return -1;
          } else if (+a > +b) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    }
  }

  remove(event: Event, o: any) {
    event.stopPropagation();

    let i: number = 0;
    for (i = 0; i < this.model.length; i++) {
      if (this.model[i] === o) {
        break;
      }
    }
    this.model.splice(i, 1);

    this.modelChange.emit(this.model);
  }
}
