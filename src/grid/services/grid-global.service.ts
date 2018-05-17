import {Inject, Injectable} from "@angular/core";

import {Dictionary} from "../model/dictionary.interface";

@Injectable()
export class GridGlobalService {

  themeChoices: Dictionary[] = [
    {value: "excel", display: "Excel"},
    {value: "report", display: "Report"}
  ];

  constructor(@Inject("globalConfig") private globalConfig) {
    if (globalConfig.themeChoices) {
      this.themeChoices = globalConfig.themeChoices;
    }
  }
}
