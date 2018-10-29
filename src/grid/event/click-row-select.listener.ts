import {isDevMode} from "@angular/core";

import {ClickListener} from "./click.interface";
import {EventListener} from "./event-listener";
import {HtmlUtil} from "../utils/html-util";
import {Point} from "../utils/point";
import {Range} from "../utils/range";

export class ClickRowSelectListener extends EventListener implements ClickListener {

  multiSelect: boolean = false;

  click(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.grid.id + ": ClickRowSelectListener.click");
    }

    let idElement: HTMLElement = HtmlUtil.getIdElement(<HTMLElement>event.target);
    if (idElement !== null && idElement.id.startsWith("row-select-")) {
      event.stopPropagation();

      let location: Point = HtmlUtil.getLocation(idElement);

      let value: boolean = this.gridService.negateSelectedRow(location.i, location.j, this.multiSelect);
      //this.grid.updateSelectedRows(new Range(location, location), !this.multiSelect, value);

      return true;
    } else {
      return false;
    }
  }

  setConfig(config: any) {
    super.setConfig(config);

    if (config.multiSelect !== undefined && config.multiSelect) {
      this.multiSelect = config.multiSelect;
    }
  }
}
