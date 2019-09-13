import {Component, HostBinding} from "@angular/core";

import {of} from "rxjs";
import {delay} from "rxjs/operators";
import * as prism from "prismjs";

import {SelectFilterRenderer, TextFilterRenderer} from "hci-ng-grid";
import {HciDataDto, HciGridDto} from "hci-ng-grid-dto";

import {DataGeneratorService} from "../services/data-generator.service";
import {SafeHtml} from "@angular/platform-browser";

@Component({
  selector: "filter-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Choices</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          This grid uses the same gender data twice.  The data is values of 1, 2, or 3.  The first column specifies manual
          choice types.  The last column specifies a url to fetch the choices from.  For example, if you rely on a REST call
          to fetch dictionaries, you would want the second option.
        </div>
        <div class="card-text">
          Last name is set to choiceAuto: true.  This means that choices are created based upon the available data.  So
          this should only be used for a data bound array.
        </div>
        <div class="card-text">
          Also to note that this demo uses an external data call with a 100-900 ms delay and the choiceUrl has a 250-750 ms
          delay.  This is important because the grid waits for the choiceUrl response before finalizing configuration and
          the column configuration is needed before the data can be prepared.  I have three choiceUrl columns here to make
          sure that the column initialization is properly waiting for all requests.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config1">Show Config</button>
          <mat-menu #config1="matMenu" class="config">
            <div [innerHTML]="config1Code"></div>
          </mat-menu>
        </div>
        <p>
          <hci-grid [title]="'Filter Grid'"
                    [dataCall]="dataCall1"
                    [columns]="columns1">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class DataTypesDemoComponent {

  @HostBinding("class") classList: string = "demo-component";

  dataCall1: (externalInfo: HciGridDto) => {};
  columns1: any[] = [
    { field: "idPatient", name: "ID", dataType: "number", visible: true },
    { field: "lastName", name: "Last Name", choiceAuto: true, filterRenderer: SelectFilterRenderer},
    { field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer },
    { field: "genderDict", name: "Gender", choices: [{v: 1, d: "F"}, {v: 2, d: "M"}, {v: 3, d: "U"}], choiceValue: "v", choiceDisplay: "d" },
    { field: "genderDict", name: "Gender Url", choiceUrl: "/api/dictionary/gender", choiceValue: "value", choiceDisplay: "display" },
    { field: "raceDict", name: "Race Url", choiceUrl: "/api/dictionary/race", choiceValue: "value", choiceDisplay: "display" },
    { field: "stateDict", name: "State Url", choiceUrl: "/api/dictionary/states", choiceValue: "value", choiceDisplay: "display" }
  ];

  config1Code: SafeHtml;
  config1Html: string = `
    <hci-grid [title]="'Filter Grid'"
              [dataCall]="dataCall1"
              [columns]="columns1">
    </hci-grid>
  `;
  config1Json: string = `
    columns1: any[] = [
      { field: "idPatient", name: "ID", dataType: "number", visible: true },
      { field: "lastName", name: "Last Name", choiceAuto: true, filterRenderer: SelectFilterRenderer},
      { field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer },
      { field: "genderDict", name: "Gender", choices: [{v: 1, d: "F"}, {v: 2, d: "M"}, {v: 3, d: "U"}], choiceValue: "v", choiceDisplay: "d" },
      { field: "genderDict", name: "Gender Url", choiceUrl: "/api/dictionary/gender", choiceValue: "value", choiceDisplay: "display" },
      { field: "raceDict", name: "Race Url", choiceUrl: "/api/dictionary/race", choiceValue: "value", choiceDisplay: "display" },
      { field: "stateDict", name: "State Url", choiceUrl: "/api/dictionary/states", choiceValue: "value", choiceDisplay: "display" }
    ];
  `;

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.config1Code = "<pre><code>"
        + prism.highlight(this.config1Html, prism.languages["html"])
        + prism.highlight(this.config1Json, prism.languages["js"])
        + "</code></pre>";

    this.dataCall1 = (externalInfo: HciGridDto) => {
      return of(new HciDataDto(this.dataGeneratorService.getData(250), externalInfo)).pipe(delay(Math.random() * 900 + 100));
    };
  }
}
