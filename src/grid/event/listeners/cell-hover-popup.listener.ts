import {isDevMode} from "@angular/core";

import {EventListener} from "../event-listener";
import {HtmlUtil} from "../../utils/html-util";
import {MouseOverListener} from "../mouse-over.interface";
import {Point} from "../../utils/point";

export class CellHoverPopupListener extends EventListener implements MouseOverListener {

  mouseOver(event: MouseEvent): boolean {
    if (isDevMode()) {
      console.debug("CellHoverPopupListener.mouseOver " + (<HTMLElement>event.target).id);
    }

    let idElement: HTMLElement = HtmlUtil.getIdElement(<HTMLElement>event.target);
    if (idElement.id.startsWith("popup-")) {
      return false;
    }
    if (idElement !== null && idElement.id.startsWith("cell-")) {
      let location: Point = HtmlUtil.getLocation(idElement);
      if (!location || !this.gridService.getColumn(location.j).popupRenderer) {
        this.grid.popupContainer.clear();
        return false;
      }
      this.grid.createPopup(location);
      return true;
    } else {
      return false;
    }
  }

}
