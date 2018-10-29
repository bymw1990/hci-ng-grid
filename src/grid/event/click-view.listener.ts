import {isDevMode} from "@angular/core";

import {ClickListener} from "./click.interface";
import {EventListener} from "./event-listener";
import {HtmlUtil} from "../utils/html-util";
import {Point} from "../utils/point";
import {Range} from "../utils/range";

export class ClickViewListener extends EventListener implements ClickListener {

  click(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("ClickViewListener.click");
    }

    let idElement: HTMLElement = HtmlUtil.getIdElement(<HTMLElement>event.target);
    if (idElement !== null && idElement.id.startsWith("click-")) {
      event.stopPropagation();

      let location: Point = HtmlUtil.getLocation(idElement);
      let key: any = this.gridService.getRow(location.i).key;
      if (isDevMode()) {
        console.debug("outputRowClick Emit: " + key);
      }
      //this.grid.updateSelectedRows(new Range(location, location), true);
      this.grid.outputRowClick.emit(key);
      return true;
    } else {
      return false;
    }
  }

}
