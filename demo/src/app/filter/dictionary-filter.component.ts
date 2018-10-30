import {FilterRenderer} from "hci-ng-grid";

import {Component} from "@angular/core";
@Component({
  selector: "dictionary-filter",
  template: `
    <div class="d-flex flex-nowrap">
    </div>
  `
})
export class DictionaryFilterRenderer extends FilterRenderer {

  setConfig(config: any) {
    super.setConfig(config);

    console.debug("DictionaryFilterRenderer.setConfig");
    console.debug(config);
  }

}
