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

      let currentEl: HTMLElement = this.grid.gridContainer.nativeElement.querySelector(".cell-popup");
      if (currentEl) {
        let currentLocation: Point = HtmlUtil.getLocation(currentEl);
        if (currentLocation && currentLocation.equals(location)) {
          return false;
        }
      }

      this.grid.clearPopup();
      if (location && this.gridService.getColumn(location.j).popupRenderer) {
        this.grid.createPopup(location);
        return true;
      }
      return false;
    } else {
      this.grid.clearPopup();
      return false;
    }
  }

}
