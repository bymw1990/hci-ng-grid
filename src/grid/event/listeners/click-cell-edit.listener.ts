import {isDevMode} from "@angular/core";

import {ClickListener} from "../click.interface";
import {EventListener} from "../event-listener";
import {HtmlUtil} from "../../utils/html-util";
import {Point} from "../../utils/point";

export class ClickCellEditListener extends EventListener implements ClickListener {

  click(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("ClickCellEditListener.click");
    }

    let idElement: HTMLElement = HtmlUtil.getIdElement(<HTMLElement>event.target);
    if (idElement !== null && idElement.id.indexOf("cell-") >= 0) {
      let location: Point = HtmlUtil.getLocation(idElement);
      if (!location) {
        return false;
      } else if (!this.gridService.getColumn(location.j).editable) {
        if (isDevMode()) {
          console.debug("ClickCellEditListener.click: Column not editable, returning false.");
        }
        return false;
      }
      this.gridEventService.setSelectedLocation(location, null);
      return true;
    } else {
      return false;
    }
  }

}
