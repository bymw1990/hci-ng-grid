import {Inject, Injectable} from "@angular/core";

@Injectable()
export class GridGlobalService {

  themeChoices: string[] = ["excel", "report"];

  constructor(@Inject("globalConfig") private globalConfig) {}
}
